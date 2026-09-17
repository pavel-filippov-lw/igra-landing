/**
 * Final reserve claim window — pure types, parsers and state derivation.
 * (FRONTEND-BRIEF-final-reserve-window.md §3–§4.)
 *
 * No I/O here: claim.ts owns the fetches and calls these parsers; WinnerFlow.tsx
 * maps the derived states to screens. Kept pure so the §4.1 / §4.3 state tables
 * are unit-tested in reserve.test.ts.
 */

export type ReserveWindowState = 'scheduled' | 'open' | 'closed' | 'finalized'

const WINDOW_STATES: readonly string[] = ['scheduled', 'open', 'closed', 'finalized']

export function isWindowState(v: unknown): v is ReserveWindowState {
  return typeof v === 'string' && WINDOW_STATES.includes(v)
}

/** GET /reserve-window. Absent (404) → the page shows the between-rounds hero. */
export interface ReserveWindow {
  state: ReserveWindowState
  opensAt: string
  closesAt: string
  /** Server clock at response time — anchor countdowns to this, not the browser clock. */
  serverTime: string
  /**
   * Live count (10 − claimed); shrinks as higher-ranked winners claim, so it is
   * always read from the API. null when the API omitted it — never assume 5.
   */
  prizesRemaining: number | null
}

export interface ReserveSubmission {
  reference: string
  submittedAt: string
  updatedAt: string
}

export type ReserveOutcome = 'selected' | 'not_selected' | null

/** POST /reserve-status for a wallet on the reserve list. */
export interface ReserveInDraw {
  inDraw: true
  /** Original draw rank — this, not submission speed, decides. */
  rank: number
  window: Pick<ReserveWindow, 'state' | 'opensAt' | 'closesAt' | 'serverTime'>
  /** null until the wallet submits. Never contains delivery data. */
  submission: ReserveSubmission | null
  /** null until window.state === 'finalized'. */
  outcome: ReserveOutcome
  /** Present only while the window is open — absent nonce = do not offer signing. */
  nonce?: string
  /** Masked (e.g. "t***@gmail.com"), only if the wallet registered during the giveaway. */
  registeredEmail?: string
}

export interface ReserveNotInDraw {
  inDraw: false
}

export type ReserveStatus = ReserveInDraw | ReserveNotInDraw

/** SIWE statement a reserve signs before submitting delivery details (§4.4). */
export const RESERVE_SIWE_STATEMENT =
  'Verify control of this wallet to submit for the Igra × Tangem final reserve window. This signature does not authorize a transaction.'

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseWindowRef(v: unknown): ReserveInDraw['window'] | null {
  if (!isObj(v)) return null
  const { state, opensAt, closesAt, serverTime } = v
  if (!isWindowState(state) || typeof opensAt !== 'string' || typeof closesAt !== 'string') return null
  return {
    state,
    opensAt,
    closesAt,
    serverTime: typeof serverTime === 'string' ? serverTime : new Date().toISOString(),
  }
}

/** Parse a GET /reserve-window body. null = not a usable window. */
export function parseReserveWindow(data: unknown): ReserveWindow | null {
  const ref = parseWindowRef(data)
  if (!ref || !isObj(data)) return null
  return {
    ...ref,
    prizesRemaining: typeof data.prizesRemaining === 'number' ? data.prizesRemaining : null,
  }
}

function parseSubmission(v: unknown): ReserveSubmission | null {
  if (!isObj(v) || typeof v.reference !== 'string' || !v.reference) return null
  const submittedAt = typeof v.submittedAt === 'string' ? v.submittedAt : ''
  return {
    reference: v.reference,
    submittedAt,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : submittedAt,
  }
}

/** Parse a POST /reserve-status body. null = unexpected shape (caller surfaces an error). */
export function parseReserveStatus(data: unknown): ReserveStatus | null {
  if (!isObj(data)) return null
  if (data.inDraw !== true) return { inDraw: false }
  const window = parseWindowRef(data.window)
  if (typeof data.rank !== 'number' || !window) return null
  const outcome: ReserveOutcome =
    data.outcome === 'selected' || data.outcome === 'not_selected' ? data.outcome : null
  const status: ReserveInDraw = {
    inDraw: true,
    rank: data.rank,
    window,
    submission: parseSubmission(data.submission),
    outcome,
  }
  if (typeof data.nonce === 'string' && data.nonce) status.nonce = data.nonce
  if (typeof data.registeredEmail === 'string' && data.registeredEmail) {
    status.registeredEmail = data.registeredEmail
  }
  return status
}

export type ReserveScreen =
  | 'scheduled'
  | 'open-new'
  | 'open-submitted'
  | 'closed'
  | 'not-selected'
  | 'selected'

/** §4.3 — which reserve screen to show for an in-draw wallet. */
export function resolveReserveScreen(s: ReserveInDraw): ReserveScreen {
  const { state } = s.window
  if (state === 'scheduled') return 'scheduled'
  if (state === 'open') return s.submission ? 'open-submitted' : 'open-new'
  if (state === 'finalized' && s.outcome === 'selected') return 'selected'
  if (state === 'finalized' && s.outcome === 'not_selected') return 'not-selected'
  // 'closed', or finalized with no outcome published yet — never show a false result.
  return 'closed'
}

export type LandingHero = 'between-rounds' | ReserveWindowState

/** §4.1 / §3.1 — landing hero. No window row (404) = between rounds, never the old Round 2 copy. */
export function resolveLandingHero(w: ReserveWindow | null): LandingHero {
  return w ? w.state : 'between-rounds'
}
