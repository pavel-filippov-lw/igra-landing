import { describe, expect, it } from 'vitest'

import { ClaimError, parseWinnerStatus } from './claim'

/**
 * winner-status parsing — the two fields the final reserve window brief adds
 * (§1 table, §3.4): `inDraw` on a non-winner, `round` on a winner.
 */
describe('parseWinnerStatus', () => {
  it('non-winner in the draw → reserve candidate (inDraw:true)', () => {
    expect(parseWinnerStatus({ selected: false, inDraw: true })).toEqual({ selected: false, inDraw: true })
  })

  it('non-winner outside the draw → inDraw:false (also when the field is absent)', () => {
    expect(parseWinnerStatus({ selected: false, inDraw: false })).toEqual({ selected: false, inDraw: false })
    expect(parseWinnerStatus({ selected: false })).toEqual({ selected: false, inDraw: false })
  })

  it('winner carries round when the API sends it', () => {
    const w = parseWinnerStatus({
      selected: true,
      rank: 57,
      round: 3,
      claimStatus: 'claimed',
      claimDeadlineAt: '2026-10-07T18:00:00Z',
      serverTime: '2026-09-25T14:02:11Z',
    })
    expect(w).toMatchObject({ selected: true, rank: 57, round: 3, claimStatus: 'claimed' })
  })

  it('winner without round → round undefined (earlier rounds still work)', () => {
    const w = parseWinnerStatus({ selected: true, rank: 11, claimStatus: 'unclaimed', serverTime: 'x' })
    expect(w).toMatchObject({ selected: true, rank: 11 })
    expect((w as { round?: number }).round).toBeUndefined()
  })

  it('winner missing rank/claimStatus → ClaimError (unexpected response)', () => {
    expect(() => parseWinnerStatus({ selected: true })).toThrow(ClaimError)
  })
})
