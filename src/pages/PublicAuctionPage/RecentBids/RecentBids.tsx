import { FC, useCallback, useEffect, useRef, useState } from "react"
import classes from './RecentBids.module.scss'

const RPC_URL = 'https://rpc.igralabs.com:8545'
const CCA_ADDRESS = '0xa1ae5E85551F0093696f32BE6952c2bb23D3068B'
const EXPLORER = 'https://explorer.igralabs.com'
const POLL_INTERVAL = 1_000
const MAX_BIDS = 10
const BLOCKS_PER_QUERY = 100_000

// BidSubmitted(uint256 indexed id, address indexed owner, uint256 price, uint128 amount)
const BID_SUBMITTED_TOPIC = '0x650baad5cd8ca09b8f580be220fa04ce2ba905a041f764b6a3fe2c848eb70540'
// bids(uint256) function selector
const BIDS_SELECTOR = '0x4423c5f1'

const STATUS_MAP = { Active: classes.statusActive, Cancelled: classes.statusCancelled, Claimed: classes.statusClaimed } as Record<string, string>

interface Bid {
  id: string
  bidder: string
  amount: string
  maxPrice: string
  status: 'Active' | 'Cancelled' | 'Claimed' | 'Unknown'
  block: number
  txHash: string
  isNew?: boolean
}

interface LogEntry {
  topics: string[]
  data: string
  blockNumber: string
  transactionHash: string
}

async function rpcBatch(calls: { method: string; params: unknown[] }[], signal?: AbortSignal) {
  const body = calls.map((c, i) => ({ jsonrpc: '2.0', id: i, method: c.method, params: c.params }))
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })
  const results = await res.json() as { id: number; result?: unknown; error?: { message: string } }[]
  return results.sort((a, b) => a.id - b.id).map(r => r.result)
}

async function rpcCall(method: string, params: unknown[], signal?: AbortSignal) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    signal,
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

function formatIKAS(hexAmount: string): string {
  const raw = BigInt(hexAmount)
  const whole = raw / 10n ** 18n
  const frac = raw % 10n ** 18n
  const fracStr = frac.toString().padStart(18, '0').slice(0, 2)
  return `${whole.toLocaleString()}.${fracStr}`
}

function formatMaxPrice(hexPrice: string): string {
  const raw = BigInt(hexPrice)
  const Q96 = 2n ** 96n
  const num = Number(raw) / Number(Q96)
  return parseFloat(num.toFixed(4)).toString()
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function relativeTime(bidBlock: number, latestBlock: number): string {
  // ~1 block/s on Igra; block timestamps drift ~4min behind wall clock
  const diff = Math.max(0, latestBlock - bidBlock)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function parseBidFromLog(log: LogEntry, status: Bid['status'] = 'Active'): Bid {
  return {
    id: BigInt(log.topics[1]).toString(),
    bidder: '0x' + log.topics[2].slice(26),
    amount: formatIKAS('0x' + log.data.slice(66, 130)),
    maxPrice: formatMaxPrice('0x' + log.data.slice(2, 66)),
    status,
    block: Number(log.blockNumber),
    txHash: log.transactionHash,
  }
}

function parseBidStatus(result: unknown): Bid['status'] {
  if (!result || result === '0x') return 'Unknown'
  const r = result as string
  // bids struct: startBlock(0), startCumulativeMps(1), exitedBlock(2), ..., tokensFilled(6)
  const exitedBlock = BigInt('0x' + r.slice(2 + 64 * 2, 2 + 64 * 3))
  const tokensFilled = BigInt('0x' + r.slice(2 + 64 * 6, 2 + 64 * 7))
  if (exitedBlock > 0n && tokensFilled > 0n) return 'Claimed'
  if (exitedBlock > 0n) return 'Cancelled'
  return 'Active'
}

async function getBidStatuses(bidIds: string[], signal?: AbortSignal): Promise<Bid['status'][]> {
  if (bidIds.length === 0) return []
  const calls = bidIds.map(id => {
    const paddedId = BigInt(id).toString(16).padStart(64, '0')
    return { method: 'eth_call', params: [{ to: CCA_ADDRESS, data: BIDS_SELECTOR + paddedId }, 'latest'] }
  })
  const results = await rpcBatch(calls, signal)
  return results.map(parseBidStatus)
}

export const RecentBids: FC = () => {
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestBlock, setLatestBlock] = useState(0)
  const lastBlockRef = useRef<number>(0)
  const knownIdsRef = useRef<Set<string>>(new Set())
  const abortRef = useRef<AbortController>()

  const loadInitial = useCallback(async (signal: AbortSignal) => {
    try {
      const latestHex = await rpcCall('eth_blockNumber', [], signal)
      const latest = Number(latestHex)
      const startBlock = Math.max(0, latest - BLOCKS_PER_QUERY)

      const logs: LogEntry[] = await rpcCall('eth_getLogs', [{
        address: CCA_ADDRESS,
        topics: [BID_SUBMITTED_TOPIC],
        fromBlock: '0x' + startBlock.toString(16),
        toBlock: '0x' + latest.toString(16),
      }], signal)

      lastBlockRef.current = latest
      setLatestBlock(latest)

      if (!logs || logs.length === 0) {
        setBids([])
        return
      }

      const recentLogs = logs.slice(-MAX_BIDS)
      const bidIds = recentLogs.map(l => BigInt(l.topics[1]).toString())
      const statuses = await getBidStatuses(bidIds, signal)

      const parsed = recentLogs.map((log, i) => parseBidFromLog(log, statuses[i])).reverse()
      parsed.forEach(b => knownIdsRef.current.add(b.id))
      setBids(parsed)
      setError(null)
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const poll = useCallback(async (signal: AbortSignal) => {
    try {
      const latestHex = await rpcCall('eth_blockNumber', [], signal)
      const latest = Number(latestHex)
      setLatestBlock(latest)
      if (latest <= lastBlockRef.current) return

      const fromBlock = lastBlockRef.current + 1
      lastBlockRef.current = latest

      const logs: LogEntry[] = await rpcCall('eth_getLogs', [{
        address: CCA_ADDRESS,
        topics: [BID_SUBMITTED_TOPIC],
        fromBlock: '0x' + fromBlock.toString(16),
        toBlock: '0x' + latest.toString(16),
      }], signal)

      if (!logs || logs.length === 0) return

      const newBids = logs.map(log => ({
        ...parseBidFromLog(log),
        isNew: !knownIdsRef.current.has(BigInt(log.topics[1]).toString()),
      })).reverse()

      newBids.forEach(b => knownIdsRef.current.add(b.id))
      setBids(prev => [...newBids, ...prev].slice(0, MAX_BIDS))

      setTimeout(() => {
        setBids(prev => prev.map(b => b.isNew ? { ...b, isNew: false } : b))
      }, 1500)
    } catch {
      // Silently ignore poll errors (network blips, aborts)
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    abortRef.current = ac

    loadInitial(ac.signal)
    const interval = setInterval(() => poll(ac.signal), POLL_INTERVAL)

    return () => {
      ac.abort()
      clearInterval(interval)
    }
  }, [loadInitial, poll])

  if (loading) {
    return (
      <div className={classes.root}>
        <h2 className={classes.heading}>Recent Bids</h2>
        <p className={classes.loading}>Loading bids…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={classes.root}>
        <h2 className={classes.heading}>Recent Bids</h2>
        <p className={classes.error}>Failed to load bids</p>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Recent Bids</h2>
      <div className={classes.tableWrap}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>BID ID</th>
              <th>BIDDER</th>
              <th>AMOUNT</th>
              <th>MAX PRICE</th>
              <th>STATUS</th>
              <th>TIME</th>
            </tr>
          </thead>
          <tbody>
            {bids.length === 0 ? (
              <tr><td colSpan={6} className={classes.empty}>No bids yet</td></tr>
            ) : (
              bids.map(bid => (
                <tr key={bid.id} className={bid.isNew ? classes.newRow : undefined}>
                  <td>
                    <a href={`${EXPLORER}/tx/${bid.txHash}`} target="_blank" rel="noopener noreferrer" className={classes.link}>
                      #{bid.id}
                    </a>
                  </td>
                  <td>
                    <a href={`${EXPLORER}/address/${bid.bidder}`} target="_blank" rel="noopener noreferrer" className={classes.link}>
                      {truncateAddress(bid.bidder)}
                    </a>
                  </td>
                  <td>{bid.amount} iKAS</td>
                  <td>{bid.maxPrice}</td>
                  <td>
                    <span className={`${classes.status} ${STATUS_MAP[bid.status] ?? ''}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td>{relativeTime(bid.block, latestBlock)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <a href="https://auctions.zealousswap.com/auctions/igra" target="_blank" rel="noopener noreferrer" className={classes.seeMore}>
        See more →
      </a>
    </div>
  )
}
