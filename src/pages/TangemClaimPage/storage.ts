/**
 * Client-side persistence for the claim flow, keyed by wallet address:
 *
 * 1. A short-lived `claimToken` (survives reload so the user skips re-signing
 *    while it's valid). The token itself is a scoped, single-purpose credential
 *    that only gates email registration and expires server-side (~15 min); we
 *    store a slightly shorter client expiry and discard it past that.
 * 2. A permanent "this wallet completed registration" flag, so a reload after
 *    finishing shows the success screen directly instead of repeating the flow.
 *
 * All values are namespaced and wallet-scoped. localStorage is best-effort:
 * failures (private mode, disabled storage) degrade to in-memory-only behaviour.
 */

const TOKEN_KEY = 'igra.tangem.claimToken'
const DONE_KEY = 'igra.tangem.registered'

/**
 * Client-side lifetime for a stored claimToken. The server token lives ~15 min;
 * we expire ours a bit earlier (12 min) so we never present a token the server
 * has already rejected.
 */
const CLAIM_TOKEN_CLIENT_TTL_MS = 12 * 60 * 1000

interface StoredToken {
  address: string
  claimToken: string
  expiresAt: number
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — degrade silently */
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

/** Save a fresh claimToken for this wallet with a client-side expiry. */
export function saveClaimToken(address: string, claimToken: string, now: number): void {
  const entry: StoredToken = {
    address: address.toLowerCase(),
    claimToken,
    expiresAt: now + CLAIM_TOKEN_CLIENT_TTL_MS,
  }
  writeJSON(TOKEN_KEY, entry)
}

/**
 * Return a still-valid stored token for this wallet, or null. Discards the entry
 * if it's for a different wallet or past its client expiry.
 */
export function loadClaimToken(address: string, now: number): { claimToken: string } | null {
  const entry = readJSON<StoredToken>(TOKEN_KEY)
  if (!entry) return null
  if (entry.address !== address.toLowerCase() || entry.expiresAt <= now) {
    remove(TOKEN_KEY)
    return null
  }
  return { claimToken: entry.claimToken }
}

export function clearClaimToken(): void {
  remove(TOKEN_KEY)
}

/**
 * Registration record kept per wallet. Only the MASKED email is stored (never
 * the raw address), so a returning user can recognise which email they used
 * without raw PII sitting in localStorage.
 */
export interface RegistrationInfo {
  maskedEmail?: string
}

type RegistrationMap = Record<string, RegistrationInfo>

/** Read the registration map, tolerating the legacy `string[]` shape. */
function readRegistrations(): RegistrationMap {
  const raw = readJSON<RegistrationMap | string[]>(DONE_KEY)
  if (Array.isArray(raw)) {
    // Legacy: array of wallet addresses, no email.
    return raw.reduce<RegistrationMap>((acc, addr) => ((acc[addr] = {}), acc), {})
  }
  return raw && typeof raw === 'object' ? raw : {}
}

/** Mark this wallet as having completed registration (permanent), with masked email. */
export function markRegistered(address: string, maskedEmail?: string): void {
  const map = readRegistrations()
  map[address.toLowerCase()] = { maskedEmail }
  writeJSON(DONE_KEY, map)
}

/** Whether this wallet already completed registration. */
export function isRegistered(address: string): boolean {
  return address.toLowerCase() in readRegistrations()
}

/** The stored registration info (masked email) for this wallet, if any. */
export function getRegistration(address: string): RegistrationInfo | null {
  return readRegistrations()[address.toLowerCase()] ?? null
}

/**
 * Wipe all persisted claim state (token + registration flags). Used by the
 * `?reset` dev flag to re-test the full flow from scratch.
 */
export function resetPersistedState(): void {
  remove(TOKEN_KEY)
  remove(DONE_KEY)
}
