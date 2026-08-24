/**
 * Plausible custom events for the vesting claim funnel, so aggregate "can't claim"
 * reasons are visible in the dashboard: wrong network, insufficient gas, rejected,
 * dropped, no allocation, …
 *
 * PRIVACY: never put wallet addresses or PII in props — only low-cardinality
 * categories (pool key, reason slug, chainId). That keeps it privacy-safe and is
 * also what Plausible needs (it rejects/￼degrades on high-cardinality props).
 *
 * NOTE: each event name below must be added as a Goal in Plausible settings before
 * it appears in the dashboard — Plausible only counts events registered as goals.
 * On localhost `window.plausible` is undefined, so these all no-op in dev.
 */

type Props = Record<string, string | number | boolean>

export function track(event: string, props?: Props): void {
  try {
    window.plausible?.(event, props ? { props } : undefined)
  } catch {
    /* analytics must never break the app */
  }
}

/** Low-cardinality reason slug for a claim/load failure (safe as a Plausible prop). */
export function errorReason(err: unknown): string {
  const raw = (err instanceof Error ? err.message : String(err)).toLowerCase()
  if (/user rejected|denied|rejected the request/.test(raw)) return 'rejected'
  if (/nothing to withdraw/.test(raw)) return 'nothing'
  if (/unknown stake/.test(raw)) return 'no-stake'
  if (/insufficient funds|not enough ikas|exceeds the balance/.test(raw)) return 'insufficient-gas'
  if (/timed out|not.*mined|receipt|drop/.test(raw)) return 'dropped'
  if (/reach|network|connection|fetch/.test(raw)) return 'network'
  return 'other'
}

/** Vesting-claim funnel event names (register these as Plausible goals). */
export const VestingEvent = {
  Connected: 'VestingWalletConnected',
  WrongNetwork: 'VestingWrongNetwork',
  NoAllocation: 'VestingNoAllocation',
  LoadError: 'VestingLoadError',
  ClaimStart: 'VestingClaimStart',
  ClaimSubmitted: 'VestingClaimSubmitted',
  ClaimConfirmed: 'VestingClaimConfirmed',
  ClaimError: 'VestingClaimError',
} as const
