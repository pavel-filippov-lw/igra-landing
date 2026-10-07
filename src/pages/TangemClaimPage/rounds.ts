/**
 * Round state for the claim page landing, from GET /giveaway/rounds
 * (FRONTEND-BRIEF-round-state.md). Everything round-specific — headline,
 * deadline, progress, winner groups — is derived from the API, so new rounds
 * need no frontend change. Pure parsing/derivation, unit-tested in rounds.test.ts.
 */

const API_URL = import.meta.env.VITE_GIVEAWAY_API_URL

export type RoundState = 'open' | 'closed'

export interface CurrentRound {
  id: number
  deadline: string
  state: RoundState
}

export interface RoundWinner {
  rank: number
  address: string
  /** Display string — 0x1234…abcd. */
  short: string
  round: number
  /** 'claimed' | 'active' | 'expired' | 'invalidated' (effective status, server-side). */
  status: string
  deadline: string | null
}

export interface RoundsView {
  prizeTarget: number
  claimedCount: number
  allClaimed: boolean
  /** Server clock — anchor countdowns to this, never the browser clock. */
  serverTime: string
  /** null when no round exists yet. */
  currentRound: CurrentRound | null
  winners: RoundWinner[]
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null

const toShort = (a: string) => (a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a)

function parseCurrentRound(v: unknown): CurrentRound | null | undefined {
  if (v === null) return null
  if (!isObj(v) || typeof v.id !== 'number' || typeof v.deadline !== 'string') return undefined
  if (v.state !== 'open' && v.state !== 'closed') return undefined
  return { id: v.id, deadline: v.deadline, state: v.state }
}

/** Parse a /rounds body. null = unusable payload (the page then shows a neutral landing). */
export function parseRounds(raw: unknown): RoundsView | null {
  if (!isObj(raw)) return null
  const { prizeTarget, claimedCount, allClaimed, serverTime } = raw
  if (typeof prizeTarget !== 'number' || typeof claimedCount !== 'number' || typeof allClaimed !== 'boolean') return null
  const currentRound = parseCurrentRound(raw.currentRound)
  if (currentRound === undefined) return null
  const winners: RoundWinner[] = (Array.isArray(raw.winners) ? raw.winners : [])
    .filter((x): x is Record<string, unknown> => isObj(x) && typeof x.rank === 'number' && typeof x.address === 'string' && typeof x.round === 'number' && typeof x.status === 'string')
    .map((x) => ({
      rank: x.rank as number,
      address: x.address as string,
      short: toShort(x.address as string),
      round: x.round as number,
      status: x.status as string,
      deadline: typeof x.deadline === 'string' ? x.deadline : null,
    }))
  return {
    prizeTarget,
    claimedCount,
    allClaimed,
    serverTime: typeof serverTime === 'string' ? serverTime : new Date().toISOString(),
    currentRound,
    winners,
  }
}

export type Headline =
  | { kind: 'allClaimed'; title: string }
  | { kind: 'open'; title: string; deadline: string }
  | { kind: 'closed'; title: string; note: string }
  | { kind: 'none'; title: string }

/** §3 headline table. allClaimed takes precedence over any round state. */
export function resolveHeadline(v: RoundsView): Headline {
  if (v.allClaimed) return { kind: 'allClaimed', title: `All ${v.prizeTarget} prizes have been claimed` }
  if (!v.currentRound) return { kind: 'none', title: 'The draw is complete' }
  if (v.currentRound.state === 'open') {
    return { kind: 'open', title: `Round ${v.currentRound.id} claims are open`, deadline: v.currentRound.deadline }
  }
  return { kind: 'closed', title: 'Claims are closed', note: 'The next round will be announced here.' }
}

export interface WinnerGroups {
  claimed: RoundWinner[]
  /** Wallets that can claim now. */
  current: RoundWinner[]
  currentLabel: string
  /** Lapsed or invalidated, any round — shown collapsed. */
  expired: RoundWinner[]
}

const byRank = (a: RoundWinner, b: RoundWinner) => a.rank - b.rank

/**
 * Groups by STATUS, not round number: an older round's wallet that is still
 * claimable stays visible, and a lapsed wallet of the current round is never
 * labelled "selected". Unknown statuses are left out rather than misreported.
 */
export function groupWinners(v: RoundsView): WinnerGroups {
  const pick = (f: (s: string) => boolean) => v.winners.filter((x) => f(x.status)).sort(byRank)
  return {
    claimed: pick((s) => s === 'claimed'),
    current: pick((s) => s === 'active'),
    currentLabel: v.currentRound ? `Round ${v.currentRound.id} selected` : 'Selected',
    expired: pick((s) => s === 'expired' || s === 'invalidated'),
  }
}

/** GET /giveaway/rounds. Resolves null on any failure — the landing must never break. */
export async function fetchRounds(): Promise<RoundsView | null> {
  if (!API_URL) return null
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/rounds`, { method: 'GET' })
    return res.ok ? parseRounds(await res.json()) : null
  } catch {
    return null
  }
}
