/**
 * Dev-only mock for the email + OTP step only (/email/start, /email/confirm), so
 * the email form can be exercised without a mail backend. Eligibility and verify
 * still hit the real API, so VITE_GIVEAWAY_API_URL is still required. Enabled
 * with VITE_GIVEAWAY_MOCK=1.
 *
 * The mock code is always "123456". `start` pretends to send it; `confirm`
 * accepts only that code (or 409s a second time to simulate "already
 * registered"). This module is imported only by claim.ts's mock branch.
 */

const MOCK = import.meta.env.VITE_GIVEAWAY_MOCK === '1'

export const isMockEnabled = MOCK

/** The fixed code the mock accepts. Shown to the user as a hint in mock mode. */
export const MOCK_CODE = '123456'

const registeredWallets = new Set<string>()

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Mock of POST /email/start — always "sends" the fixed code. */
export async function mockStart(email: string): Promise<void> {
  await delay(500)
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    // Simulate a 400 on bad email.
    throw new Error('bad email')
  }
  // Pretend an email was sent.
}

/** Mock of POST /email/confirm — accepts only MOCK_CODE. */
export async function mockConfirm(wallet: string, code: string): Promise<void> {
  await delay(500)
  if (registeredWallets.has(wallet)) {
    // Simulate 409 already-registered (claim.ts treats this as success).
    return
  }
  if (code !== MOCK_CODE) {
    throw new Error('bad code')
  }
  registeredWallets.add(wallet)
}
