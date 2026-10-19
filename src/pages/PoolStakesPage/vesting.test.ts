import { describe, expect, it } from 'vitest'

import { scheduleProgress, vestingWalletStake } from './vesting'

/** The DAO Proposal #17 analyst grant, as read from Igra mainnet on 19 Oct 2026. */
const START = 1_791_331_200 // 7 Oct 2026 00:00 UTC
const DURATION = 7_948_800 // 92 days
const IGRA = 10n ** 18n
const BENEFICIARY = '0xb9825280859405a9ccd855BcAFf844882F1b81E6'

describe('scheduleProgress', () => {
  it('has not started before the start', () => {
    expect(scheduleProgress(START, START + DURATION, START - 1)).toEqual({ notStarted: true, vestedFraction: 0 })
  })

  it('vests linearly in between', () => {
    const p = scheduleProgress(START, START + DURATION, START + DURATION / 4)
    expect(p.notStarted).toBe(false)
    expect(p.vestedFraction).toBeCloseTo(0.25)
  })

  it('caps at fully vested after the end', () => {
    expect(scheduleProgress(START, START + DURATION, START + DURATION + 1)).toEqual({ notStarted: false, vestedFraction: 1 })
  })

  it('treats an empty window as nothing vested', () => {
    expect(scheduleProgress(START, START, START + 10).vestedFraction).toBe(0)
  })
})

describe('vestingWalletStake', () => {
  const reads = {
    owner: BENEFICIARY,
    start: BigInt(START),
    duration: BigInt(DURATION),
    balance: 500_000n * IGRA,
    released: 0n,
    releasable: 67_253n * IGRA,
  }

  it('shows the grant to its beneficiary, whatever the address casing', () => {
    expect(vestingWalletStake(reads, BENEFICIARY.toLowerCase())).toEqual({
      allocated: 500_000n * IGRA,
      released: 0n,
      releasable: 67_253n * IGRA,
      claimable: 67_253n * IGRA,
      start: START,
      end: START + DURATION,
      vestingDays: 92,
    })
  })

  it('hides it from every other wallet', () => {
    expect(vestingWalletStake(reads, '0x4454CE34aC14e66b35f53DE9EA42999c2b8a9d44')).toBeNull()
  })

  it('hides a wallet that was never funded', () => {
    expect(vestingWalletStake({ ...reads, balance: 0n, releasable: 0n }, BENEFICIARY)).toBeNull()
  })

  it('counts tokens already released in the total allocation', () => {
    const stake = vestingWalletStake({ ...reads, balance: 400_000n * IGRA, released: 100_000n * IGRA }, BENEFICIARY)
    expect(stake?.allocated).toBe(500_000n * IGRA)
    expect(stake?.released).toBe(100_000n * IGRA)
  })
})
