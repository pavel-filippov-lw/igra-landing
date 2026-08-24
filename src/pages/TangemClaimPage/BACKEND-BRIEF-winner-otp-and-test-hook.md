# Backend brief — winners' claim flow: OTP deadline fix + test-winner hook

Two small backend changes for the Tangem **winners' claim** page (frontend is done and
wired to the live API). I found both while testing the live endpoints. I prototyped them
on a local branch in the `apis` checkout — **`fix/winner-otp-and-test-hook`** (single commit
`c75673c`), touching `routes/giveaway.js` + `test/claim.test.js` + `test/email-otp.test.js`.
Nothing was pushed, nothing is on `main`, nothing is deployed. **Review and apply it however
you prefer** — cherry-pick the commit, or re-implement from the diffs below. All **101 backend
tests pass** with these changes.

---

## 1. BUG (please fix) — email OTP is blocked after the registration deadline

`POST /giveaway/email/start` and `/giveaway/email/confirm` currently return
**403 "Registration is closed"**, because they're in the `REGISTRATION_PATHS` set gated by
`GIVEAWAY_DEADLINE` (15 Aug, already passed).

The winners' claim flow **reuses those endpoints to verify a delivery email**. So any winner
who needs to enter a fresh email — i.e. anyone who didn't register during the giveaway, or who
picks "use another email" — is blocked. (Winners who *did* register can still one-click their
registered address via `useRegisteredEmail`, which doesn't call `/email/*`.)

**Fix:** drop `/email/*` from that guard. They remain `claimToken`-gated + rate-limited, and
`/claim` independently enforces `CLAIM_DEADLINE`, so nothing is left unprotected.

```diff
+// Only /eligibility is registration-only. The email OTP endpoints are reused by
+// the winners' claim flow to verify a delivery email, so they must stay open past
+// the registration deadline (they remain claimToken-gated + rate-limited, and
+// /claim independently enforces CLAIM_DEADLINE).
 const REGISTRATION_PATHS = new Set([
   '/giveaway/eligibility',
-  '/giveaway/email/start',
-  '/giveaway/email/confirm',
 ])
```

**Tests:** the two `email-otp.test.js` tests that asserted 403-after-deadline for `/email/start`
and `/email/confirm` were updated to assert they now proceed past the guard (401 on a dummy
token, not 403), each wrapped in `try/finally` so a failing assertion can't leak
`GIVEAWAY_DEADLINE` into later tests. The `/eligibility` 403-after-deadline test is unchanged
(that endpoint stays registration-gated).

---

## 2. Test hook (optional) — `GIVEAWAY_TEST_WINNERS`

So we can click through the whole claim flow **in prod with a real wallet** without putting a
throwaway address on the public winners list. Addresses in this env var are recognized by
`winner-status` / `verify` / `claim` (and treated as **eligible**, so the claim signature
verifies without being in the ZAP eligibility file), but are **excluded from `GET /winners`**.

```diff
+// Test winners: recognized by winner-status / verify / claim so the full claim
+// flow can be exercised in production, but HIDDEN from the public GET /winners
+// list (that stays the real GIVEAWAY_WINNERS). They are also treated as eligible,
+// so a test wallet's claim signature verifies without being in the ZAP eligibility
+// file. Set GIVEAWAY_TEST_WINNERS='["0x…"]' to test; UNSET it when done.
+let testWinnerAddresses = []
+if (process.env.GIVEAWAY_TEST_WINNERS) {
+  try {
+    testWinnerAddresses = JSON.parse(process.env.GIVEAWAY_TEST_WINNERS)
+  } catch (err) {
+    console.error(`[giveaway] Invalid GIVEAWAY_TEST_WINNERS JSON: ${err.message}`)
+  }
+  if (testWinnerAddresses.length) {
+    console.warn(`[giveaway] ${testWinnerAddresses.length} TEST winner(s) active — unset GIVEAWAY_TEST_WINNERS in production`)
+  }
+}
+
 const giveaway = createGiveaway({
-  eligibleAddresses,
+  eligibleAddresses: [...eligibleAddresses, ...testWinnerAddresses],
   deadline: process.env.GIVEAWAY_DEADLINE || '',
   secret: process.env.GIVEAWAY_SECRET || '',
 })
```

```diff
-const winnerSet = new Set(winnerAddresses.map(a => a.toLowerCase()))
-const winnerRanks = new Map(winnerAddresses.map((a, i) => [a.toLowerCase(), i + 1]))
+// Real winners first (rank = list position); test winners appended after, so a
+// test wallet gets an obvious rank past the real 10. GET /winners maps only
+// `winnerAddresses`, so test winners never appear in the public list.
+const allWinners = [...winnerAddresses, ...testWinnerAddresses]
+const winnerSet = new Set(allWinners.map(a => a.toLowerCase()))
+const winnerRanks = new Map(allWinners.map((a, i) => [a.toLowerCase(), i + 1]))
```

`GET /winners` is unchanged — it already maps `winnerAddresses` only, so test winners never
appear there.

**Tests:** 3 added to `claim.test.js` (a `GIVEAWAY_TEST_WINNERS` describe block): the test
winner is selected in `winner-status` and ranked after the real winners; it's hidden from
`GET /winners`; and it can verify + claim without being in the eligibility file. `afterEach`
also now clears `GIVEAWAY_TEST_WINNERS`.

**Usage:**
1. Set config var `GIVEAWAY_TEST_WINNERS='["0xTHEWALLET"]'` (dyno restarts — the winner list is
   read at boot, so a restart is required).
2. Test winner shows up as rank #11 (after the real 10).
3. **Cleanup when done:** unset `GIVEAWAY_TEST_WINNERS`; `DELETE FROM claims WHERE wallet =
   '0xthewallet'` (lowercased); optionally delete its `registrations` row if it OTP'd a new email.

---

## Deploy

Deploy however you normally do (Heroku). Neither change alters existing behavior for real
winners; change 1 only *unblocks* the email endpoints, change 2 is inert unless
`GIVEAWAY_TEST_WINNERS` is set.

## Frontend

No frontend change is needed — it already handles "no registered email → collect + OTP a
delivery email", and one-click reuse via `useRegisteredEmail`. The frontend is on the live API
already (`https://apis.igralabs.com/giveaway`).
