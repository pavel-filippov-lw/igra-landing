/**
 * The public "Winning wallets" list for the draw-complete page.
 *
 * The user chose to fetch this from the backend, but the API has no winners-list
 * endpoint yet (GET /giveaway/winners → 404). So we fetch from that path and fall
 * back to the embedded list below until the endpoint ships. The 10 winners are
 * public anyway — shown truncated here and derivable from the verifiable draw
 * (github.com/IgraLabs/tangem-zap-giveaway-2026).
 */

const API_URL = import.meta.env.VITE_GIVEAWAY_API_URL

export interface Winner {
  rank: number
  /** Display string — a shortened 0x1234…abcd address. */
  short: string
}

/** Rank-ordered winning wallets (truncated for display). */
const FALLBACK_WINNERS: string[] = [
  '0x5e65…258b',
  '0x6766…e6cf',
  '0x0cdb…4769',
  '0xa350…bd40',
  '0xa910…b242',
  '0x6795…9d5c',
  '0xac02…ad8e',
  '0x8f4d…70e2',
  '0xf596…9fac',
  '0xc9b2…f9ac',
]

/** Shorten a full 0x address; pass through anything already truncated. */
function toShort(addr: string): string {
  if (addr.includes('…') || addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

const fallback = (): Winner[] => FALLBACK_WINNERS.map((short, i) => ({ rank: i + 1, short }))

interface RawWinner {
  rank?: number
  address?: string
  short?: string
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
      }))
      .filter((w) => w.short.length > 0)
      .sort((a, b) => a.rank - b.rank)
    return list.length > 0 ? list : fallback()
  } catch {
    return fallback()
  }
}
