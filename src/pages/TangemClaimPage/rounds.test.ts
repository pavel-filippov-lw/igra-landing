import { describe, expect, it } from 'vitest'

import { groupWinners, parseRounds, resolveHeadline, type RoundsView } from './rounds'

/** Spec for FRONTEND-BRIEF-round-state.md §2–§3 (GET /giveaway/rounds → landing). */

const A = (n: number) => `0x${n.toString(16).padStart(4, '0')}${'ab'.repeat(16)}cdef`
const w = (rank: number, round: number, status: string, deadline = '2026-09-14T18:00:00.000Z') => ({
  rank, address: A(rank), round, status, deadline,
})

// Shape of the live API on 7 Oct 2026: round 2 closed, 5 claimed, 13 lapsed.
const LIVE = {
  prizeTarget: 10,
  claimedCount: 5,
  allClaimed: false,
  serverTime: '2026-10-07T15:01:55.912Z',
  currentRound: { id: 2, deadline: '2026-09-14T18:00:00.000Z', state: 'closed' },
  winners: [
    w(1, 1, 'claimed'), w(10, 1, 'claimed'),
    ...[2, 3, 4, 5, 6, 7, 8, 9].map((r) => w(r, 1, 'expired')),
    w(12, 2, 'claimed'), w(13, 2, 'claimed'), w(17, 2, 'claimed'),
    ...[11, 14, 15, 16, 18].map((r) => w(r, 2, 'expired')),
  ],
}

const view = (over: Partial<RoundsView> = {}): RoundsView => ({ ...(parseRounds(LIVE) as RoundsView), ...over })

describe('parseRounds', () => {
  it('parses the live shape and shortens addresses', () => {
    const v = parseRounds(LIVE)!
    expect(v).toMatchObject({ prizeTarget: 10, claimedCount: 5, allClaimed: false, currentRound: { id: 2, state: 'closed' } })
    expect(v.winners).toHaveLength(18)
    expect(v.winners[0].short).toMatch(/^0x[0-9a-f]{4}…[0-9a-f]{4}$/)
  })

  it('accepts currentRound: null', () => {
    expect(parseRounds({ ...LIVE, currentRound: null })!.currentRound).toBeNull()
  })

  it('rejects an unusable payload', () => {
    expect(parseRounds(null)).toBeNull()
    expect(parseRounds({ ...LIVE, prizeTarget: 'ten' })).toBeNull()
    expect(parseRounds({ ...LIVE, currentRound: { id: 3, deadline: 'x', state: 'paused' } })).toBeNull()
  })

  it('drops malformed winner rows instead of failing the page', () => {
    expect(parseRounds({ ...LIVE, winners: [...LIVE.winners, { rank: 'x' }] })!.winners).toHaveLength(18)
  })
})

describe('resolveHeadline — §3 table', () => {
  it('open round → "Round N claims are open" with its deadline', () => {
    const h = resolveHeadline(view({ currentRound: { id: 3, deadline: '2026-10-21T18:00:00.000Z', state: 'open' } }))
    expect(h).toEqual({ kind: 'open', title: 'Round 3 claims are open', deadline: '2026-10-21T18:00:00.000Z' })
  })

  it('closed round → "Claims are closed" + next-round note (what the live page shows today)', () => {
    expect(resolveHeadline(view())).toEqual({ kind: 'closed', title: 'Claims are closed', note: 'The next round will be announced here.' })
  })

  it('no round yet → "The draw is complete"', () => {
    expect(resolveHeadline(view({ currentRound: null }))).toEqual({ kind: 'none', title: 'The draw is complete' })
  })

  it('allClaimed wins over everything, using prizeTarget', () => {
    const h = resolveHeadline(view({ allClaimed: true, currentRound: { id: 4, deadline: '2026-11-01T18:00:00.000Z', state: 'open' } }))
    expect(h).toEqual({ kind: 'allClaimed', title: 'All 10 prizes have been claimed' })
  })
})

describe('groupWinners — status first, no round numbers hardcoded', () => {
  it('live data: 5 claimed, nobody selected, 13 lapsed in the collapsed group', () => {
    const g = groupWinners(view())
    expect(g.claimed.map((x) => x.rank)).toEqual([1, 10, 12, 13, 17])
    expect(g.current).toEqual([])
    expect(g.expired.map((x) => x.rank)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 11, 14, 15, 16, 18])
  })

  it('open round: active wallets form the current group, labelled with the round id', () => {
    const v = view({
      currentRound: { id: 3, deadline: '2026-10-21T18:00:00.000Z', state: 'open' },
      winners: [...view().winners.filter((x) => x.rank !== 4), { ...view().winners.find((x) => x.rank === 4)!, round: 3, status: 'active' }],
    })
    const g = groupWinners(v)
    expect(g.current.map((x) => x.rank)).toEqual([4])
    expect(g.currentLabel).toBe('Round 3 selected')
    expect(g.expired.map((x) => x.rank)).not.toContain(4)
  })

  it('invalidated wallets are grouped with expired, never as selected or claimed', () => {
    const v = view({ winners: [{ ...view().winners[2], status: 'invalidated' }] })
    const g = groupWinners(v)
    expect(g.expired).toHaveLength(1)
    expect(g.claimed).toHaveLength(0)
    expect(g.current).toHaveLength(0)
  })
})
