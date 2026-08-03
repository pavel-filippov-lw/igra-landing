# Backend brief — replace Tally with native email + OTP (Resend + DB)

**Decision:** Drop Tally entirely. Email collection, OTP verification, and
registration storage move into the Igra giveaway backend. Email is sent via
**Resend**; registrations live in **our DB**. This gives real 6-digit OTP,
an on-brand native form, no third-party form UI, and one source of truth.

**Audience:** backend dev on the giveaway service (`/Users/emdin/Projects/igra/apis`,
`giveaway.js` + `routes/giveaway.js`).

**What already exists and stays unchanged:**
- `POST /giveaway/eligibility` → `{eligible, nonce, deadline?}`
- `POST /giveaway/verify` → `{claimToken}` (SIWE sig check, stateless HMAC JWT token)

**What to remove:** the Tally webhook (`POST /giveaway/webhook`) and anything
Tally-related. The frontend no longer embeds Tally.

---

## New flow (replaces the Tally step)

```
[unchanged] connect wallet → /eligibility → sign SIWE → /verify → claimToken
[NEW]       enter email  → POST /giveaway/email/start  {claimToken, email}  → sends 6-digit code
[NEW]       enter code   → POST /giveaway/email/confirm {claimToken, email, code} → registers
```

The `claimToken` (already issued by `/verify`) is the auth for both new endpoints —
it proves the wallet was verified. Keep treating it as the single-use, short-lived,
wallet-bound credential it already is.

---

## New endpoint 1 — `POST /giveaway/email/start`

Sends a 6-digit OTP to the email. Auth = `claimToken`.

Request:
```json
{ "claimToken": "<from /verify>", "email": "user@example.com" }
```

Server MUST:
1. **Validate `claimToken`** (verifyClaimToken: signature + exp + it decodes to a
   wallet). Reject if invalid/expired → `401`.
2. Validate `email` format. Reject bad format → `400`.
3. Generate a **6-digit numeric code**, store `{ wallet, email, codeHash, expiresAt,
   attempts:0 }` keyed by `wallet` (from the claimToken), TTL ~10 min. Store a
   **hash** of the code, not the plaintext.
4. **Rate-limit**: max ~5 sends per wallet per hour; also per-IP. Prevents email
   bombing.
5. Send the code via **Resend** (see Resend section). Subject e.g. "Your Tangem ×
   Igra verification code". Body: the 6-digit code + "expires in 10 minutes".

Response (200): `{ "ok": true }` (don't leak whether the email was "new").
Errors: `401` bad token, `400` bad email, `429` rate-limited. Always JSON.

---

## New endpoint 2 — `POST /giveaway/email/confirm`

Verifies the code and writes the registration.

Request:
```json
{ "claimToken": "<same>", "email": "user@example.com", "code": "123456" }
```

Server MUST:
1. **Validate `claimToken`** again (`401` if bad/expired).
2. Look up the stored code for this `wallet` (from claimToken). If none/expired →
   `400 {"error":"code expired"}`.
3. Check `email` matches the one `start` was called with, and **compare `code`**
   against the stored hash (constant-time). On mismatch, increment `attempts`;
   after ~5 wrong tries invalidate the code → `400`.
4. On match: **write the registration** to the DB (see schema). Enforce
   **one-registration-per-wallet** here via a unique constraint on `wallet`
   (this is now enforceable server-side, unlike the earlier Tally best-effort
   plan — nice upgrade). If the wallet already registered, either return `200`
   idempotently or `409` — your call; the frontend treats non-2xx as retryable
   and 2xx as success.
5. Consume/delete the OTP record and (optionally) mark the claimToken used.

Response (200): `{ "ok": true }` → frontend shows the "You're registered" success
state. Errors: `400` wrong/expired code, `401` bad token, `409` already registered.

---

## DB schema (registrations)

Minimum viable — one row per registrant:

| column | type | notes |
| --- | --- | --- |
| `wallet` | text, **unique**, PK | checksummed or lowercased consistently |
| `email` | text | the verified email |
| `email_verified_at` | timestamptz | set at confirm time |
| `created_at` | timestamptz | |
| `winner_status` | enum/text | `none` \| `winner` \| `reserve` — for the draw |
| `fulfillment_status` | text/null | filled post-draw |

Plus a short-lived OTP store (can be a table or Redis; expires ~10 min):
`wallet, email, code_hash, expires_at, attempts`.

**Admin view** (per the original requirements) reads from `registrations`:
eligibility (implicit — only eligible wallets can register), verified email,
winner/reserve status, claim deadline (the giveaway `deadline`), fulfillment
status. **Never** expose the claimToken, SIWE signature, or OTP codes.

---

## Resend integration

- Use the Resend Node SDK (`resend` npm) or their REST API.
- Env: `RESEND_API_KEY`, `GIVEAWAY_EMAIL_FROM` (e.g. `Igra × Tangem
  <giveaway@igra.network>` — must match the contact address in the legal docs and
  be a verified sending domain in Resend).
- Send the OTP email in `email/start`. Keep the template plain: the 6-digit code,
  a one-line what-it's-for, and the 10-min expiry. No links needed (this is a code,
  not a magic link).
- Handle Resend send failures gracefully → return `500 {"error":"could not send"}`;
  the frontend will show a retry message.

---

## CORS / cross-cutting (same as existing endpoints)

- Both new endpoints are called cross-origin from the browser (`igralabs.com`,
  Netlify previews, `localhost:5173`). Return the same CORS headers + handle
  `OPTIONS` preflight, exactly like `/eligibility` and `/verify` already do.
- Public, **no auth header** — the `claimToken` in the body is the credential.
- Always return JSON, including on errors.
- Rate-limit both (per-IP and per-wallet).

---

## Frontend changes (I'll handle these — listed so contracts line up)

- Remove the Tally iframe + `VITE_TALLY_FORM_ID`.
- After `/verify` → `claimToken`, render a **native two-step form** styled to the
  site (dark + teal):
  1. email input → `POST /email/start`
  2. 6-digit code input → `POST /email/confirm` → success screen
     ("You're registered! …").
- All calls hit `VITE_GIVEAWAY_API_URL` (same base as today).

I need from you: the two endpoints above live, and confirmation of the exact
success/error shapes (I've assumed `{ok:true}` on success, JSON `{error}` otherwise
— tell me if you diverge).
