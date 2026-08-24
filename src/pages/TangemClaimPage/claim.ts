import { getAddress, type Address } from 'viem'

import { isMockEnabled, mockConfirm, mockStart } from './mockApi'

/**
 * Claim flow logic for the Igra × Tangem giveaway (API + SIWE message building).
 * Wallet connection and message signing are handled by wagmi/AppKit in the
 * component (see appkit.ts); this module is transport + message construction only.
 *
 * Security model (see API.md for the backend contract):
 * - The wallet ONLY signs a SIWE (EIP-4361) message. No transaction, no gas.
 * - The nonce is issued by the server, and the signature is verified server-side.
 *   The client never trusts its own signature check — that would give zero replay
 *   protection. The signed message is meaningless without the server round-trip.
 * - The frontend never persists private keys or a reusable signature. The only
 *   credential it holds after verification is an opaque, short-lived `claimToken`
 *   that is single-purpose (gates email registration) and scoped to this giveaway.
 */

const API_URL = import.meta.env.VITE_GIVEAWAY_API_URL

/** SIWE statement shown to the user in their wallet before signing (registration flow). */
const SIWE_STATEMENT =
  'Verify ownership of your wallet to register for the Igra × Tangem giveaway. This is a free signature — it does not authorize any transaction.'

/** SIWE statement shown to a winner proving control of their winning wallet before claiming. */
export const WINNER_SIWE_STATEMENT =
  'Verify control of this winning wallet to claim an Igra × Tangem Giveaway prize. This signature does not authorize a transaction.'

export interface EligibilityResponse {
  /** Whether this address participated in ZAP and may register. */
  eligible: boolean
  /** Server-issued, single-use nonce to embed in the SIWE message. */
  nonce: string
  /**
   * Optional human-readable deadline the server may return. Informational only —
   * the UI shows its own fixed deadline constant, so this is not displayed.
   */
  deadline?: string
}

export interface VerifyResponse {
  /**
   * Opaque, short-lived token proving the wallet was verified. Used to authorize
   * the email + OTP registration step (see startEmailVerification / confirm).
   */
  claimToken: string
}

export class ClaimError extends Error {
  constructor(
    message: string,
    readonly kind: 'config' | 'wallet' | 'network' | 'server' | 'expired' = 'server',
  ) {
    super(message)
    this.name = 'ClaimError'
  }
}

function requireApiUrl(): string {
  if (!API_URL) {
    throw new ClaimError(
      'The giveaway is not configured yet. Please check back soon.',
      'config',
    )
  }
  return API_URL.replace(/\/$/, '')
}

/** Check eligibility and obtain a server nonce for the given address. */
export async function fetchEligibility(address: Address): Promise<EligibilityResponse> {
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (!res.ok) {
    throw new ClaimError('The giveaway service returned an error. Please try again later.', 'server')
  }
  const data = (await res.json()) as Partial<EligibilityResponse>
  if (typeof data.eligible !== 'boolean' || (data.eligible && typeof data.nonce !== 'string')) {
    throw new ClaimError('Unexpected response from the giveaway service.', 'server')
  }
  return { eligible: data.eligible, nonce: data.nonce ?? '', deadline: data.deadline }
}

/**
 * Build an EIP-4361 (SIWE) message. Kept deliberately close to the spec so the
 * backend can parse/validate it with a standard SIWE library.
 */
export function buildSiweMessage(
  address: Address,
  nonce: string,
  issuedAt: string,
  statement: string = SIWE_STATEMENT,
): string {
  const domain = window.location.host
  const uri = window.location.origin + window.location.pathname
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    statement,
    '',
    `URI: ${uri}`,
    'Version: 1',
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join('\n')
}

/** Submit the signed SIWE message for server-side verification; get a claim token. */
export async function verifyClaim(
  address: Address,
  message: string,
  signature: `0x${string}`,
): Promise<VerifyResponse> {
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, message, signature }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (!res.ok) {
    throw new ClaimError('Verification failed. The signature or nonce may have expired — please retry.', 'server')
  }
  const data = (await res.json()) as Partial<VerifyResponse>
  if (typeof data.claimToken !== 'string' || !data.claimToken) {
    throw new ClaimError('Unexpected response from the giveaway service.', 'server')
  }
  return { claimToken: data.claimToken }
}

/**
 * Start email verification: sends a 6-digit OTP to `email`. Authorised by the
 * `claimToken` from verifyClaim (proves the wallet was verified).
 */
export async function startEmailVerification(claimToken: string, email: string): Promise<void> {
  if (isMockEnabled) {
    try {
      await mockStart(email)
    } catch {
      throw new ClaimError('Could not send the verification code. Check the email address and retry.', 'server')
    }
    return
  }
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/email/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimToken, email }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (res.status === 401) {
    throw new ClaimError('Your session expired. Please sign again to continue.', 'expired')
  }
  if (res.status === 429) {
    throw new ClaimError('Too many attempts. Please wait a bit before requesting another code.', 'server')
  }
  if (!res.ok) {
    throw new ClaimError('Could not send the verification code. Check the email address and retry.', 'server')
  }
}

/**
 * Confirm email verification with the 6-digit code. On success the wallet+email
 * registration is written server-side. Authorised by the same `claimToken`.
 */
export async function confirmEmailVerification(
  claimToken: string,
  email: string,
  code: string,
): Promise<void> {
  if (isMockEnabled) {
    try {
      await mockConfirm(claimToken, code)
    } catch {
      throw new ClaimError('That code is incorrect or expired. Please check it and try again.', 'server')
    }
    return
  }
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/email/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimToken, email, code }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (res.status === 409) {
    // Already registered — treat as success (idempotent from the user's view).
    return
  }
  if (res.status === 401) {
    throw new ClaimError('Your session expired. Please sign again to continue.', 'expired')
  }
  if (!res.ok) {
    throw new ClaimError('That code is incorrect or expired. Please check it and try again.', 'server')
  }
}

/** Normalise any address string to an EIP-55 checksummed address. */
export function toChecksum(address: string): Address {
  return getAddress(address)
}

/** Format an address as 0x1234…abcd for display. */
export function shortAddress(address: string): string {
  return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address
}

/**
 * Mask an email for display so the user can recognise it without fully exposing
 * it, e.g. `jane.doe@gmail.com` → `ja••••@gmail.com`. Keeps the first two chars
 * of the local part and the full domain.
 */
export function maskEmail(email: string): string {
  const at = email.indexOf('@')
  if (at < 1) return email
  const local = email.slice(0, at)
  const domain = email.slice(at)
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'•'.repeat(3)}${domain}`
}

/* ------------------------------------------------------------------ *
 *  Winners' claim flow (draw complete).                              *
 *  Contract verified live against apis.igralabs.com/giveaway         *
 *  (apis repo routes/giveaway.js @ main): winner-status + claim.     *
 * ------------------------------------------------------------------ */

/** winner-status for a non-winning wallet. */
interface NotSelected {
  selected: false
}

/** winner-status for a winning wallet (unclaimed, or already claimed). */
export interface WinnerSelected {
  selected: true
  rank: number
  /** Backend emits 'unclaimed' | 'claimed'; treat anything ≠ 'unclaimed' as a returning claim. */
  claimStatus: string
  /** ISO deadline for THIS wallet (per-wallet — reserves get their own). Null if unset. */
  claimDeadlineAt: string | null
  /** Server clock at response time — anchor the countdown to this, not the browser clock. */
  serverTime: string
  /** Single-use SIWE nonce — present only while unclaimed. */
  nonce?: string
  /** Masked registered email (e.g. "t***@gmail.com"), if the wallet registered one. */
  registeredEmail?: string
  /** Present once claimed. */
  claimRef?: string
  claimedAt?: string
  trackingUrl?: string
}

export type WinnerStatus = NotSelected | WinnerSelected

/** POST /winner-status — is this wallet a winner, and what is its claim state? */
export async function fetchWinnerStatus(address: Address): Promise<WinnerStatus> {
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/winner-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (!res.ok) {
    throw new ClaimError('The giveaway service returned an error. Please try again later.', 'server')
  }
  const data = (await res.json()) as Partial<WinnerSelected> & { selected?: unknown }
  if (data.selected !== true) return { selected: false }
  if (typeof data.rank !== 'number' || typeof data.claimStatus !== 'string') {
    throw new ClaimError('Unexpected response from the giveaway service.', 'server')
  }
  return {
    selected: true,
    rank: data.rank,
    claimStatus: data.claimStatus,
    claimDeadlineAt: typeof data.claimDeadlineAt === 'string' ? data.claimDeadlineAt : null,
    serverTime: typeof data.serverTime === 'string' ? data.serverTime : new Date().toISOString(),
    nonce: data.nonce,
    registeredEmail: data.registeredEmail,
    claimRef: data.claimRef,
    claimedAt: data.claimedAt,
    trackingUrl: data.trackingUrl,
  }
}

/** Delivery details submitted with a claim. */
export interface ClaimDetails {
  fullName: string
  email: string
  country: string
  addressLine1: string
  addressLine2?: string
  city: string
  region?: string
  postalCode: string
  telephone?: string
}

export interface ClaimResult {
  claimRef: string
  claimedAt: string
}

async function errorMessage(res: Response, fallback: string): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: unknown } | null
  return body && typeof body.error === 'string' && body.error ? body.error : fallback
}

/**
 * POST /claim — submit delivery details for a verified winning wallet, authorised
 * by the `claimToken` from verifyClaim. The five required confirmations are always
 * sent true; the UI blocks submit until every box is ticked.
 *
 * When `useRegisteredEmail` is true, the backend resolves the wallet's already-
 * verified registration email server-side (the client only ever sees it masked),
 * and `details.email` is ignored — no OTP needed. Otherwise `details.email` (which
 * the UI OTP-verifies first) is used.
 */
export async function submitClaim(
  claimToken: string,
  details: ClaimDetails,
  useRegisteredEmail = false,
): Promise<ClaimResult> {
  const base = requireApiUrl()
  let res: Response
  try {
    res = await fetch(`${base}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claimToken,
        useRegisteredEmail,
        fullName: details.fullName,
        email: details.email,
        country: details.country,
        addressLine1: details.addressLine1,
        addressLine2: details.addressLine2 ?? '',
        city: details.city,
        region: details.region ?? '',
        postalCode: details.postalCode,
        telephone: details.telephone ?? '',
        ageConfirmed: true,
        lawfulReceiptConfirmed: true,
        householdLimitConfirmed: true,
        rulesAccepted: true,
        privacyAccepted: true,
      }),
    })
  } catch {
    throw new ClaimError('Could not reach the giveaway service. Check your connection and retry.', 'network')
  }
  if (res.status === 401) {
    throw new ClaimError('Your session expired. Please sign again to continue.', 'expired')
  }
  if (res.status === 409) {
    throw new ClaimError('This wallet has already submitted a claim.', 'server')
  }
  if (res.status === 403) {
    // Not a winner, or the claim deadline has passed — surface the server's message.
    throw new ClaimError(await errorMessage(res, 'This claim can no longer be submitted.'), 'server')
  }
  if (!res.ok) {
    throw new ClaimError(await errorMessage(res, 'Could not submit your claim. Please check your details and retry.'), 'server')
  }
  const data = (await res.json()) as Partial<ClaimResult>
  if (typeof data.claimRef !== 'string') {
    throw new ClaimError('Unexpected response from the giveaway service.', 'server')
  }
  return {
    claimRef: data.claimRef,
    claimedAt: typeof data.claimedAt === 'string' ? data.claimedAt : new Date().toISOString(),
  }
}
