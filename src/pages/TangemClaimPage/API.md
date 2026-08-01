# Tangem × Igra Giveaway — Backend API contract

**Audience:** backend developer implementing the giveaway service.
**Frontend:** static SPA at `https://igralabs.com/tangem-claim` (this repo). It is
already built against this contract — implement it exactly and the integration
works with no frontend changes. The client source of truth is
`src/pages/TangemClaimPage/claim.ts`.

All trust-bearing logic lives in **your** service. The frontend never verifies a
signature itself, never holds the eligibility list, and never persists a private
key or reusable signature.

---

## 0. Summary

Two JSON endpoints, both `POST`, both under one base URL:

| Endpoint | Body in | Body out | Purpose |
| --- | --- | --- | --- |
| `POST {BASE}/eligibility` | `{address}` | `{eligible, nonce, deadline?}` | Is this wallet a ZAP participant? Issue a nonce. |
| `POST {BASE}/verify` | `{address, message, signature}` | `{claimToken}` | Verify the SIWE signature; issue a one-time claim token. |

Plus a lightweight **Tally submission webhook** that just validates the claim
token's signature (registrations themselves are stored by Tally, not the backend).
The backend can be **fully stateless** — see §6 Persistence.

`{BASE}` is whatever you deploy; the frontend reads it from
`VITE_GIVEAWAY_API_URL` (no trailing slash). Give this URL to whoever sets the
Netlify env vars.

**Recommended host/path (matches existing Igra services):** the site's other
public APIs live under **`apis.igralabs.com`** (plural), one path segment per
service — e.g. `https://apis.igralabs.com/igra-token`,
`https://apis.igralabs.com/twap/price/…`. Follow that convention:

```
{BASE} = https://apis.igralabs.com/giveaway
  → POST https://apis.igralabs.com/giveaway/eligibility
  → POST https://apis.igralabs.com/giveaway/verify
```

Those existing `apis.igralabs.com` endpoints are already fetched cross-origin from
this same static site and are public/unauthenticated — so that host already has
CORS for `igralabs.com` and the right posture for this API.

### Auth

**None.** These endpoints are public and unauthenticated by design: they are called
from an anonymous browser before the user has any identity, and a static SPA cannot
hold a secret API key (anything shipped to the client is public). Security comes
from the **wallet signature + server nonce** (see `/verify`), not from a bearer
token — that *is* the authentication, and it's stronger here than a shared secret.
Gate abuse at the **CORS + rate-limit** layer (both specified above), not with an
Authorization header (the client sends none).

Flow:
```
connect wallet (client, Igra Network or Ethereum)
  → POST /eligibility {address}                 → {eligible, nonce, deadline?}
  → sign SIWE message (client, personal_sign — NO transaction, NO gas)
  → POST /verify {address, message, signature}  → {claimToken}
  → Tally form embedded with wallet + claimToken as hidden fields
  → Tally stores the registration (email + wallet); its webhook only validates
    the claimToken's signature. Backend stays stateless. (§6)
```

---

## 1. Cross-cutting requirements (read first)

These are the things most likely to break a real integration:

- **CORS.** The browser calls this API **cross-origin** from `https://igralabs.com`
  (and from Netlify deploy previews `https://deploy-preview-*--igra-landing.netlify.app`,
  and `http://localhost:5173` during dev). You MUST return CORS headers or the
  browser blocks the response:
  ```
  Access-Control-Allow-Origin: https://igralabs.com      # echo the request Origin if allow-listing multiple
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```
  Handle the `OPTIONS` preflight (return 204 with the headers above). No cookies
  or credentials are sent, so `Access-Control-Allow-Credentials` is not needed.
- **Always return JSON**, including on errors. The client calls `res.json()`
  whenever `res.ok`; a non-JSON body (e.g. an HTML 502 page) surfaces as a generic
  error. On success the body MUST be JSON with the fields below.
- **Addresses are EIP-55 checksummed.** The client sends the address via viem's
  `getAddress()` (mixed-case checksum, e.g. `0x29d4…3C78`). Compare
  case-insensitively (lowercase both sides) or re-checksum; never assume lowercase.
- **Client ignores error bodies and status codes** beyond `res.ok`
  (2xx vs not). You may return 400/401/409/500 as appropriate for your own logs,
  but the user-facing text is decided by the frontend (see each endpoint). Don't
  invest in structured error payloads — they aren't read.
- **Rate-limit** both endpoints (per-IP and per-address). `/eligibility` is an
  address-enumeration oracle; `/verify` is a signature-check endpoint.
- **No auth header.** The frontend sends no Authorization/API-key header. If you
  need to gate the API, do it at the network/CORS layer, not via a header the
  client would have to send (it won't).

---

## 2. `POST {BASE}/eligibility`

Request (headers: `Content-Type: application/json`):
```json
{ "address": "0x29d4...3C78" }
```

Success response `200`, `Content-Type: application/json`:
```json
{
  "eligible": true,
  "nonce": "8f2c1e...random",
  "deadline": "August 15, 2026"
}
```

Field rules (the client validates these — see `fetchEligibility`):
- `eligible` — **required**, boolean. Did this address participate in ZAP? Look up
  against the **private** ZAP-participant dataset. This list MUST NOT be exposed to
  the client or embedded in any response other than this boolean.
- `nonce` — **required when `eligible === true`** (client rejects the response if
  `eligible` is true and `nonce` is missing/not a string). Must be:
  - cryptographically random, unguessable;
  - **single-use** and **bound to this address**;
  - short TTL (recommend 10 min);
  - stored server-side as `(address → nonce, issuedAt, used=false)`.
  This is the anti-replay anchor. When `eligible === false`, `nonce` may be
  omitted/empty — the client stops here and shows a "not a ZAP participant"
  message (no signing prompt).
- `deadline` — optional, **human-readable string** shown verbatim to the user
  (e.g. `"August 15, 2026"`). Not parsed. Omit if you don't want to show one.

Client behavior:
- Non-2xx → user sees *"The giveaway service returned an error. Please try again
  later."*
- Network failure / CORS block → *"Could not reach the giveaway service. Check your
  connection and retry."* (this is the error currently shown because the URL points
  at a mock).
- `eligible: false` → *"This wallet isn't in the list of ZAP participants…"* with a
  "try a different wallet" action.

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

Built by `claim.ts::buildSiweMessage`. It is a near-EIP-4361 string, joined with
`\n`. **Important:** it deliberately has **no `Chain ID` line** (the giveaway
accepts wallets on Igra Network *or* Ethereum, and eligibility is proven by the
signature, which is chain-agnostic). Do **not** use a strict SIWE parser that
*requires* `Chain ID`/`Issued At`-with-address fields, or validate the raw string
per the template below.

```
{host} wants you to sign in with your Ethereum account:
{address}

Verify ownership of your wallet to register for the Tangem × Igra giveaway. This is a free signature — it does not authorize any transaction.

URI: {uri}
Version: 1
Nonce: {nonce}
Issued At: {ISO-8601 timestamp}
```

- `{host}` = `window.location.host` → in production `igralabs.com`; on previews the
  Netlify host; in dev `localhost:5173` (includes port). Do a loose check (e.g.
  endsWith `igralabs.com` in prod) rather than exact-match, or ignore it — the
  security comes from the nonce + signature, not the domain line.
- `{address}` = the same checksummed address as the top-level `address` field.
- `{uri}` = `origin + pathname` (e.g. `https://igralabs.com/tangem-claim`).
- `{nonce}` = the nonce you issued in `/eligibility`.
- `Issued At` = client ISO-8601 timestamp (informational; you may sanity-check it's
  recent, but the nonce TTL is the real freshness control).

### Server MUST

1. Parse out the `Nonce` and `address` from `message` (or validate the whole
   string against the template above).
2. **Recover the signer** from `signature` over `message` using **EIP-191
   `personal_sign`** (i.e. the `\x19Ethereum Signed Message:\n{len}` prefix — what
   `eth_sign`/`personal_sign` and viem's `verifyMessage` use). Confirm it equals
   the top-level `address` (case-insensitive).
   - Note: some smart-contract wallets use **EIP-1271**. Tangem/MetaMask/Rabby are
     EOAs and use EIP-191, so EIP-191 is sufficient; add EIP-1271 only if you later
     support contract wallets.
3. Confirm the `Nonce` matches the **unused, unexpired** nonce for this `address`.
   Then **consume it** (mark used) so it can't be replayed. (Nonce store may be
   in-memory — see Persistence below.)
4. **Re-confirm eligibility** server-side (don't trust that `/eligibility` was
   called honestly before this).

(One-registration-per-wallet is **not** enforced here — see Persistence below;
dedup happens at draw time from the Tally export.)

Success response `200`:
```json
{ "claimToken": "opaque-single-use-short-lived-token" }
```

- `claimToken` — **required**, non-empty string (client rejects otherwise). It is:
  - **opaque** to the client (treated as a blob). **Recommended: a signed,
    stateless JWT** carrying `{ address, exp }` — this needs **no server storage**
    and survives dyno restarts. (A random id backed by a server record also works
    but reintroduces state.)
  - **short-lived** (recommend ≤ 15 min — the user goes straight to the Tally form);
  - **single-purpose**: it ONLY authorizes the Tally submission for THIS wallet. It
    is **not** a session token and must grant no other capability.

Client behavior:
- Non-2xx → *"Verification failed. The signature or nonce may have expired — please
  retry."*
- If the user rejects the signature in their wallet, `/verify` is never called; the
  client shows *"Signature was rejected…"* locally.

---

## 4. Tally submission webhook (backend-owned)

The frontend embeds Tally with two **hidden fields** passed as URL params
(`https://tally.so/embed/{FORM_ID}?wallet=0x..&claimToken=..`). The Tally form must
define hidden fields named exactly:
- `wallet` — the verified checksummed address
- `claimToken` — the token from `/verify`

**Tally is the system of record for registrations** — it durably stores each
submission (wallet, email, timestamps) and provides the admin table/export. The
backend does **not** store registrations.

On Tally's submission webhook, the backend SHOULD:
- **Validate `claimToken`**: verify the JWT signature and `exp`, and that its
  embedded address **matches the submitted `wallet`**. This rejects submissions
  that didn't go through wallet verification. Being a signed token, this check is
  **stateless** — no DB lookup.
- That's it. There is intentionally **no server-side write** here.

Not enforced at submission time: **one-registration-per-wallet**. See Persistence.

(Configuring the Tally webhook + hidden fields is done in Tally's dashboard; the
frontend only forwards the two params.)

---

## 5. Admin view (Tally)

Registrations are viewed/managed in **Tally** (its responses table + export). Per
requirements, the following are visible per registrant:
- verified email (from Tally)
- wallet (hidden field)
- winner / reserve status, claim deadline, fulfillment status — tracked as
  columns/tags in Tally (or a sheet exported from it)

Never expose private keys or any reusable signature. The `claimToken` (a scoped,
short-lived JWT) and the raw SIWE `signature` are verification implementation
details — they are not stored as registration data and should not appear in the
admin view.

---

## 6. Persistence — what needs a database (answers "in-memory OK on Heroku?")

Heroku dynos restart routinely — on every deploy and at least once per ~24h — so
treat in-memory state as "gone within a day." Mapping each piece of data:

| Data | Store | In-memory / restart-safe? |
| --- | --- | --- |
| **Registrations** (wallet, email, winner, fulfillment) | **Tally** | ✅ Tally persists it — not the backend's concern |
| **Nonces** (`/eligibility` → `/verify`) | backend | ✅ **In-memory is fine.** Short-lived + single-use. A restart mid-flow just makes that user re-sign ("verification failed, retry"). |
| **Claim tokens** (`/verify` → Tally webhook) | backend | ✅ **Stateless JWT → no storage at all.** Restart-proof by construction. |
| **One-registration-per-wallet** | — | ⚠️ **Best-effort only (by decision).** NOT enforced server-side. |

**Result: the backend can be fully stateless** — in-memory nonces + signed JWT
claim tokens. A dyno restart costs at most an in-flight user one extra signature.
No database is required for the flow to work.

### One-per-wallet: best-effort (deliberate choice)

We are **not** enforcing one-registration-per-wallet in the backend (that would
require a durable store of completed wallets, which we're avoiding). Instead:

- A wallet *could* submit the Tally form more than once (e.g. two emails, or after
  a restart). That is accepted at collection time.
- **Deduplicate by `wallet` at draw time** from the Tally export before selecting
  winners — keep the first submission per wallet, drop the rest.
- Note: Tally's native "one response per respondent" dedups on the respondent, not
  on the hidden `wallet` field, so it does not give wallet-level uniqueness on its
  own. Wallet dedup is a draw-time step.

If strict, real-time one-per-wallet is ever required, the minimal addition is a
single durable set of redeemed wallet addresses (a one-column table / Redis)
checked in the Tally webhook — but that reintroduces backend persistence.

---

## 6. Local end-to-end testing

To exercise the full flow before the real backend exists, point the frontend at any
stub returning the shapes above:

```
# .env.local (gitignored)
VITE_GIVEAWAY_API_URL=http://localhost:8787   # your stub
VITE_TALLY_FORM_ID=<real form id>
VITE_WALLETCONNECT_PROJECT_ID=<real Reown project id>
```

Minimal stub contract to unblock a demo:
- `POST /eligibility` → `200 {"eligible": true, "nonce": "<random>", "deadline": "August 15, 2026"}`
  (remember CORS headers + `OPTIONS` preflight for `http://localhost:5173`).
- `POST /verify` → verify EIP-191 sig + consume nonce → `200 {"claimToken": "<token>"}`.

The current `.env.local` in this repo points `VITE_GIVEAWAY_API_URL` at a
placeholder (`https://mock.local/giveaway`), which is why the live page shows
"Could not reach the giveaway service" after signing — that resolves the moment a
real (or stub) URL is set.
