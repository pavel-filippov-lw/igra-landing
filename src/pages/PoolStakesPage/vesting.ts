/**
 * Pure vesting math shared by both grant types (no chain access, unit-tested).
 */

/** Where `now` sits in a linear [start, end] window (unix seconds); fraction clamped to [0, 1]. */
export function scheduleProgress(start: number, end: number, now: number) {
  return {
    notStarted: now < start,
    vestedFraction: end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0,
  }
}

/** Raw reads from an OpenZeppelin VestingWallet for the vested token. */
export interface VestingWalletReads {
  /** The beneficiary — vested tokens are always released to this address. */
  owner: string
  start: bigint
  duration: bigint
  /** The wallet's current token balance. */
  balance: bigint
  released: bigint
  releasable: bigint
}

/**
 * A VestingWallet grant as the card shows it, or null when `holder` is not the
 * beneficiary or nothing was ever deposited. OpenZeppelin vests `balance + released`
 * linearly, so that sum is the total allocation; `releasable` is exactly what
 * `release(token)` pays out now.
 */
export function vestingWalletStake(reads: VestingWalletReads, holder: string) {
  if (reads.owner.toLowerCase() !== holder.toLowerCase()) return null
  const allocated = reads.balance + reads.released
  if (allocated === 0n) return null
  const start = Number(reads.start)
  return {
    allocated,
    released: reads.released,
    releasable: reads.releasable,
    claimable: reads.releasable,
    start,
    end: start + Number(reads.duration),
    vestingDays: Number(reads.duration) / 86_400,
  }
}
