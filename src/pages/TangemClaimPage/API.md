# Igra × Tangem Giveaway — Backend API contract

**Audience:** backend developer implementing the giveaway service.
**Frontend:** static SPA at `https://igralabs.com/tangem-claim` (this repo). It is
already built against this contract — implement it exactly and the integration
works with no frontend changes. The client source of truth is
`src/pages/TangemClaimPage/claim.ts`.

> **Note on the email step.** The flow no longer uses Tally. Email collection +
> OTP verification + registration storage now live in the backend. This file
> covers the wallet part (`/eligibility`, `/verify`); the email part
> (`/email/start`, `/email/confirm`, Resend, DB) is specified in
> **`BACKEND-BRIEF-email-otp.md`** in this folder. Read both.

All trust-bearing logic lives in **your** service. The frontend never verifies a
signature itself, never holds the eligibility list, and never persists a private
key or reusable signature.

---

## 0. Summary

Endpoints (all `POST`, JSON, under one base URL):

| Endpoint | Body in | Body out | Purpose |
| --- | --- | --- | --- |
| `POST {BASE}/eligibility` | `{address}` | `{eligible, nonce, deadline?}` | Is this wallet a ZAP participant? Issue a nonce. |
| `POST {BASE}/verify` | `{address, message, signature}` | `{claimToken}` | Verify the SIWE signature; issue a one-time claim token. |
| `POST {BASE}/email/start` | `{claimToken, email}` | `{ok:true}` | Send a 6-digit OTP (see the email brief). |
| `POST {BASE}/email/confirm` | `{claimToken, email, code}` | `{ok:true}` | Verify the code; write the registration (see the email brief). |

`{BASE}` is whatever you deploy; the frontend reads it from
`VITE_GIVEAWAY_API_URL` (no trailing slash). Recommended host follows existing
Igra services (`apis.igralabs.com/<service>`):

```
{BASE} = https://apis.igralabs.com/giveaway
  → POST https://apis.igralabs.com/giveaway/eligibility
  → POST https://apis.igralabs.com/giveaway/verify
  → POST https://apis.igralabs.com/giveaway/email/start     (see email brief)
  → POST https://apis.igralabs.com/giveaway/email/confirm   (see email brief)
```

Those existing `apis.igralabs.com` endpoints are already fetched cross-origin from
this same static site, so that host already has CORS for `igralabs.com`.

### Auth

**None.** These endpoints are public and unauthenticated by design: they are
called from an anonymous browser before the user has any identity, and a static
SPA cannot hold a secret. Security comes from the **wallet signature + server
nonce** (see `/verify`) and, for the email step, from the single-use `claimToken`
— not from a bearer token. Gate abuse at the **CORS + rate-limit** layer, not with
an Authorization header (the client sends none).

Flow:
```
connect wallet (client, Igra Network or Ethereum)
  → POST /eligibility {address}                 → {eligible, nonce, deadline?}
  → sign SIWE message (client, personal_sign — NO transaction, NO gas)
  → POST /verify {address, message, signature}  → {claimToken}
  → email step: /email/start → OTP email → /email/confirm  (see email brief)
```

---

## 1. Cross-cutting requirements (read first)

- **CORS.** The browser calls this API **cross-origin** from `https://igralabs.com`
  (and Netlify deploy previews `https://deploy-preview-*--igra-landing.netlify.app`,
  and `http://localhost:5173` in dev). Return CORS headers + handle the `OPTIONS`
  preflight (204):
  ```
  Access-Control-Allow-Origin: https://igralabs.com   # or echo the request Origin
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```
  No cookies/credentials are sent.
- **Always return JSON**, including on errors. The client calls `res.json()` on
  `res.ok`; a non-JSON body (e.g. an HTML 502) surfaces as a generic error.
- **Addresses are EIP-55 checksummed.** The client sends the address via viem's
  `getAddress()`. Compare case-insensitively; never assume lowercase.
- **Client ignores error bodies/status codes** beyond `res.ok` (2xx vs not), except
  it treats **401** on the email endpoints as "session expired → sign again" and
  **409** on `/email/confirm` as idempotent success. Use those two status codes
  accordingly; other user-facing text is decided by the frontend.
- **Rate-limit** every endpoint (per-IP and per-address/wallet).

---

## 2. `POST {BASE}/eligibility`

Request (`Content-Type: application/json`):
```json
{ "address": "0x29d4...3C78" }
```

Success `200`:
```json
{
  "eligible": true,
  "nonce": "8f2c1e...random",
  "deadline": "15 August 2026, 23:59 UTC"
}
```

- `eligible` — **required** boolean. Look up against the **private**
  ZAP-participant dataset (≥500 iKAS gross bids). Never expose the list.
- `nonce` — **required when `eligible === true`** (client rejects otherwise). Must
  be cryptographically random, single-use, bound to this address, short TTL
  (≈10 min), stored server-side as `(address → nonce, unused)`. This is the
  anti-replay anchor.
- `deadline` — optional human-readable string. The frontend currently displays its
  own fixed deadline, so this value is informational; if you send one, use
  `"15 August 2026, 23:59 UTC"` for consistency.

When `eligible: false`, the client shows the "not eligible" message (no signing).

---

## 3. `POST {BASE}/verify`

Request:
```json
{
  "address": "0x29d4...3C78",
  "message": "<the exact SIWE string the client signed, verbatim>",
  "signature": "0x<130 hex chars>"
}
```

### The exact SIWE message

Built by `claim.ts::buildSiweMessage`. Near-EIP-4361, joined with `\n`.
**Important:** it has **no `Chain ID` line** (the giveaway accepts Igra Network *or*
Ethereum; eligibility is proven by the signature, which is chain-agnostic). Do not
use a strict SIWE parser that *requires* `Chain ID`.

```
{host} wants you to sign in with your Ethereum account:
{address}

Verify ownership of your wallet to register for the Igra × Tangem giveaway. This is a free signature — it does not authorize any transaction.

URI: {uri}
Version: 1
Nonce: {nonce}
Issued At: {ISO-8601 timestamp}
```

- `{host}` = `window.location.host` → prod `igralabs.com`; previews the Netlify
  host; dev `localhost:5173`. Do a loose check (endsWith `igralabs.com` in prod) or
  ignore it — security is the nonce + signature, not the domain line.
- `{address}` = the same checksummed address as the top-level field.
- `{uri}` = `origin + pathname` (e.g. `https://igralabs.com/tangem-claim`).
- `{nonce}` = the nonce from `/eligibility`.

### Server MUST

1. Parse the `Nonce` and `address` from `message`.
2. **Recover the signer** from `signature` over `message` using **EIP-191
   `personal_sign`** (what `ethers.verifyMessage` / viem `verifyMessage` use).
   Confirm it equals the top-level `address` (case-insensitive). (Tangem/MetaMask/
   Rabby are EOAs → EIP-191; add EIP-1271 only if you support contract wallets.)
3. Confirm the `Nonce` matches the **stored, unused, unexpired** nonce for this
   address, then **consume it** (mark used) so it can't be replayed.
4. **Re-confirm eligibility** server-side.

Success `200`:
```json
{ "claimToken": "opaque-single-use-short-lived-token" }
```

- `claimToken` — **required**, non-empty. Recommended: a **signed, stateless JWT**
  carrying `{ address, exp }` (no server storage; survives restarts). Short-lived
  (~30 min). Single-purpose: it only authorizes the email step for THIS wallet; it
  is **not** a session token.

Non-2xx → the client shows "Verification failed — please retry."

---

## 4. Email + OTP, persistence, admin

The email step (`/email/start`, `/email/confirm`), the Resend integration, the DB
schema (`registrations`, `otp_codes`), one-per-wallet handling, and the admin view
are all specified in **`BACKEND-BRIEF-email-otp.md`** in this folder. That is the
authoritative spec for the post-`/verify` part of the flow.

---

## 5. Local end-to-end testing

Point the frontend at any stub returning the shapes above:

```
# .env.local (gitignored) — see .env.example
VITE_GIVEAWAY_API_URL=http://localhost:8787        # your stub
VITE_WALLETCONNECT_PROJECT_ID=<real Reown project id>
VITE_GIVEAWAY_MOCK=1                                # optional: mock only /email/*
```

Minimal stub to unblock a demo (remember CORS + `OPTIONS` for `http://localhost:5173`):
- `POST /eligibility` → `200 {"eligible": true, "nonce": "<random>", "deadline": "15 August 2026, 23:59 UTC"}`
- `POST /verify` → verify EIP-191 sig + consume nonce → `200 {"claimToken": "<token>"}`

With `VITE_GIVEAWAY_MOCK=1`, the frontend mocks only the OTP endpoints (code
`123456`); eligibility + verify still call the stub/real API.
