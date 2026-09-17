import { describe, expect, it } from 'vitest'

import {
  parseReserveStatus,
  parseReserveWindow,
  RESERVE_SIWE_STATEMENT,
  resolveLandingHero,
  resolveReserveScreen,
  type ReserveInDraw,
} from './reserve'

/**
 * Spec for the final reserve window logic (FRONTEND-BRIEF-final-reserve-window.md).
 * These cover the pure parts: API shape parsing and the screen/hero state tables
 * (§4.1, §4.3). Rendering is exercised separately against the stub.
 */

const window = (state: ReserveInDraw['window']['state']): ReserveInDraw['window'] => ({
  state,
  opensAt: '2026-09-23T18:00:00Z',
  closesAt: '2026-10-07T18:00:00Z',
  serverTime: '2026-09-25T14:02:11Z',
})

const submission = { reference: 'RSV-0057', submittedAt: '2026-09-24T09:10:00Z', updatedAt: '2026-09-24T09:10:00Z' }

const reserve = (over: Partial<ReserveInDraw>): ReserveInDraw => ({
  inDraw: true,
  rank: 57,
  window: window('open'),
  submission: null,
  outcome: null,
  ...over,
})

describe('resolveReserveScreen — §4.3 state table', () => {
  it('scheduled → opening-date screen, no CTA', () => {
    expect(resolveReserveScreen(reserve({ window: window('scheduled') }))).toBe('scheduled')
  })

  it('open + no submission → can submit', () => {
    expect(resolveReserveScreen(reserve({ window: window('open'), submission: null }))).toBe('open-new')
  })

  it('open + submission → received, can edit', () => {
    expect(resolveReserveScreen(reserve({ window: window('open'), submission }))).toBe('open-submitted')
  })

  it('closed → selection in progress, regardless of submission', () => {
    expect(resolveReserveScreen(reserve({ window: window('closed') }))).toBe('closed')
    expect(resolveReserveScreen(reserve({ window: window('closed'), submission }))).toBe('closed')
  })

  it('finalized + not_selected → not selected', () => {
    expect(resolveReserveScreen(reserve({ window: window('finalized'), submission, outcome: 'not_selected' }))).toBe(
      'not-selected',
    )
  })

  it('finalized + selected → selected (normally unreachable; wallet becomes a winner)', () => {
    expect(resolveReserveScreen(reserve({ window: window('finalized'), submission, outcome: 'selected' }))).toBe(
      'selected',
    )
  })

  it('finalized with no outcome yet → treated as still closed (never a false result)', () => {
    expect(resolveReserveScreen(reserve({ window: window('finalized'), submission, outcome: null }))).toBe('closed')
  })
})

describe('resolveLandingHero — §4.1 / §3.1', () => {
  it('no window row (404) → between-rounds hero, never the old Round 2 copy', () => {
    expect(resolveLandingHero(null)).toBe('between-rounds')
  })

  it.each(['scheduled', 'open', 'closed', 'finalized'] as const)('window %s → %s hero', (state) => {
    expect(
      resolveLandingHero({
        state,
        opensAt: '2026-09-23T18:00:00Z',
        closesAt: '2026-10-07T18:00:00Z',
        serverTime: '2026-09-20T10:15:00Z',
        prizesRemaining: 5,
      }),
    ).toBe(state)
  })
})

describe('parseReserveWindow — GET /reserve-window', () => {
  const valid = {
    state: 'scheduled',
    opensAt: '2026-09-23T18:00:00Z',
    closesAt: '2026-10-07T18:00:00Z',
    serverTime: '2026-09-20T10:15:00Z',
    prizesRemaining: 5,
  }

  it('parses the documented shape', () => {
    expect(parseReserveWindow(valid)).toEqual(valid)
  })

  it('prizesRemaining is read from the API, never assumed (missing → null, not 5)', () => {
    expect(parseReserveWindow({ ...valid, prizesRemaining: undefined })).toMatchObject({
      state: 'scheduled',
      prizesRemaining: null,
    })
  })

  it('rejects unknown states and non-objects', () => {
    expect(parseReserveWindow({ ...valid, state: 'paused' })).toBeNull()
    expect(parseReserveWindow(null)).toBeNull()
    expect(parseReserveWindow('nope')).toBeNull()
  })

  it('rejects a window without both dates', () => {
    expect(parseReserveWindow({ ...valid, closesAt: undefined })).toBeNull()
  })
})

describe('parseReserveStatus — POST /reserve-status', () => {
  const full = {
    inDraw: true,
    rank: 57,
    window: window('open'),
    submission,
    outcome: null,
    nonce: '8f2c1e',
    registeredEmail: 't***@gmail.com',
  }

  it('parses the documented shape', () => {
    expect(parseReserveStatus(full)).toEqual(full)
  })

  it('inDraw:false → not a reserve (existing not-selected screen)', () => {
    expect(parseReserveStatus({ inDraw: false })).toEqual({ inDraw: false })
  })

  it('submission null stays null; never fabricates one', () => {
    expect(parseReserveStatus({ ...full, submission: null })).toMatchObject({ submission: null })
    expect(parseReserveStatus({ ...full, submission: {} })).toMatchObject({ submission: null })
  })

  it('outcome is only selected | not_selected | null', () => {
    expect(parseReserveStatus({ ...full, outcome: 'selected' })).toMatchObject({ outcome: 'selected' })
    expect(parseReserveStatus({ ...full, outcome: 'not_selected' })).toMatchObject({ outcome: 'not_selected' })
    expect(parseReserveStatus({ ...full, outcome: 'maybe' })).toMatchObject({ outcome: null })
  })

  it('rejects an in-draw response missing rank or a valid window', () => {
    expect(parseReserveStatus({ ...full, rank: undefined })).toBeNull()
    expect(parseReserveStatus({ ...full, window: { ...full.window, state: 'nope' } })).toBeNull()
    expect(parseReserveStatus(undefined)).toBeNull()
  })
})

describe('RESERVE_SIWE_STATEMENT — §4.4', () => {
  it('names the final reserve window and disclaims any transaction', () => {
    expect(RESERVE_SIWE_STATEMENT).toContain('final reserve window')
    expect(RESERVE_SIWE_STATEMENT).toContain('does not authorize a transaction')
  })
})
