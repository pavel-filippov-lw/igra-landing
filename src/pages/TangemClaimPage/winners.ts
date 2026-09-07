/**
 * The public "Winning wallets" list for the claim page.
 *
 * Fetched from the backend (GET /giveaway/winners), which returns a rank-ordered
 * array of { rank, address, round, status }. `round` is 1 (original draw) or 2
 * (reserve wallets promoted after Round 1 expiries); `status` is 'claimed',
 * 'expired' or 'active'. The embedded list below is a fallback used only when the
 * endpoint is unreachable — the wallets are public anyway and derivable from the
 * verifiable draw (github.com/IgraLabs/tangem-zap-giveaway-2026).
 */

const API_URL = import.meta.env.VITE_GIVEAWAY_API_URL

export interface Winner {
  rank: number
  /** Display string — a shortened 0x1234…abcd address. */
  short: string
  /** 1 = original draw, 2 = reserve wallet promoted for Round 2. */
  round: number
  /** 'claimed' | 'expired' | 'active'. */
  status: string
}

/** Rank-ordered winning wallets (truncated for display) — offline fallback only. */
const FALLBACK_WINNERS: Winner[] = [
  { rank: 1, short: '0x5e65…258b', round: 1, status: 'claimed' },
  { rank: 2, short: '0x6766…e6cf', round: 1, status: 'expired' },
  { rank: 3, short: '0x0cdb…4769', round: 1, status: 'expired' },
  { rank: 4, short: '0xa350…bd40', round: 1, status: 'expired' },
  { rank: 5, short: '0xa910…b242', round: 1, status: 'expired' },
  { rank: 6, short: '0x6795…9d5c', round: 1, status: 'expired' },
  { rank: 7, short: '0xac02…ad8e', round: 1, status: 'expired' },
  { rank: 8, short: '0x8f4d…70e2', round: 1, status: 'expired' },
  { rank: 9, short: '0xf596…9fac', round: 1, status: 'expired' },
  { rank: 10, short: '0xc9b2…9aac', round: 1, status: 'claimed' },
  { rank: 11, short: '0x9912…90da', round: 2, status: 'active' },
  { rank: 12, short: '0x48c7…02d4', round: 2, status: 'active' },
  { rank: 13, short: '0x1da8…b317', round: 2, status: 'active' },
  { rank: 14, short: '0xcfc8…7b59', round: 2, status: 'active' },
  { rank: 15, short: '0xfc69…3098', round: 2, status: 'active' },
  { rank: 16, short: '0x947b…bfe0', round: 2, status: 'active' },
  { rank: 17, short: '0xd08f…786b', round: 2, status: 'active' },
  { rank: 18, short: '0x16df…6568', round: 2, status: 'active' },
]

/** Shorten a full 0x address; pass through anything already truncated. */
function toShort(addr: string): string {
  if (addr.includes('…') || addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

const fallback = (): Winner[] => FALLBACK_WINNERS.map((w) => ({ ...w }))

interface RawWinner {
  rank?: number
  address?: string
  short?: string
  round?: number
  status?: string
}

/**
 * Fetch the winners list from the backend, falling back to the embedded public
 * list if the endpoint is unavailable or returns nothing usable.
 */
export async function fetchWinners(): Promise<Winner[]> {
  if (!API_URL) return fallback()
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/winners`, { method: 'GET' })
    if (!res.ok) return fallback()
    const data: unknown = await res.json()
    if (!Array.isArray(data) || data.length === 0) return fallback()
    const list = (data as RawWinner[])
      .map((w, i) => ({
        rank: typeof w.rank === 'number' ? w.rank : i + 1,
        short: toShort(String(w.address ?? w.short ?? '')),
        round: typeof w.round === 'number' ? w.round : 1,
        status: typeof w.status === 'string' ? w.status : 'active',
      }))
      .filter((w) => w.short.length > 0)
      .sort((a, b) => a.rank - b.rank)
    return list.length > 0 ? list : fallback()
  } catch {
    return fallback()
  }
}
