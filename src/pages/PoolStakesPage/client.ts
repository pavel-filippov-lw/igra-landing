/**
 * Contract access for the PoolStakes dapp.
 *
 * Reads go through a plain viem public client against the Galleon RPC — they
 * need no wallet, so the dashboard renders even when WalletConnect is not
 * configured. Only the write path (claim / split) needs the connected wallet.
 */
import {
  createPublicClient,
  defineChain,
  formatUnits,
  getAddress,
  http,
  type Hash,
  type WalletClient,
} from 'viem'

import { poolStakesAbi } from './abi/poolStakes'
import { vestingPoolsAbi } from './abi/vestingPools'
import {
  CHAIN,
  CLONES,
  MIN_GAS_BALANCE,
  REVERT_MESSAGES,
  TX_GAS_LIMIT,
  TX_GAS_PRICE,
  type CloneInfo,
  type Hex,
} from './constants'

export const chain = defineChain({
  id: CHAIN.id,
  name: CHAIN.name,
  nativeCurrency: { name: CHAIN.nativeSymbol, symbol: CHAIN.nativeSymbol, decimals: 18 },
  rpcUrls: { default: { http: [CHAIN.rpcUrl] } },
  blockExplorers: { default: { name: `${CHAIN.name} Explorer`, url: CHAIN.explorer } },
  testnet: true,
})

export const publicClient = createPublicClient({
  chain,
  transport: http(CHAIN.rpcUrl),
})

export interface Position {
  clone: CloneInfo
  /** Total ever allocated to this holder (wei). */
  allocated: bigint
  /** Already withdrawn (wei). */
  released: bigint
  /** releasableAmount(holder) — vested-and-pulled, withdrawable right now (wei). */
  releasable: bigint
  /**
   * What we DISPLAY as "claimable": releasableAmount + unclaimedShare. Adding the
   * un-pulled share makes the number move smoothly with time instead of sitting
   * frozen until someone calls claimVesting(), and matches what claimAndWithdraw()
   * actually pays out.
   */
  claimable: bigint
  /** Vesting window, unix seconds. */
  start: number
  end: number
  vestingDays: number
  notStarted: boolean
  /** Fraction vested [0..1], clamped. */
  vestedFraction: number
}

/**
 * Read a single holder's position in one clone. Returns null when the wallet has
 * no stake there (allocated == 0) — the caller uses that to decide membership.
 */
export async function loadPosition(clone: CloneInfo, holder: Hex): Promise<Position | null> {
  const address = getAddress(clone.address)
  const account = getAddress(holder)

  const [stake, releasable, unclaimed, poolId, vestingPoolsAddr, block] = await Promise.all([
    publicClient.readContract({ address, abi: poolStakesAbi, functionName: 'stakes', args: [account] }),
    publicClient.readContract({ address, abi: poolStakesAbi, functionName: 'releasableAmount', args: [account] }),
    publicClient.readContract({ address, abi: poolStakesAbi, functionName: 'unclaimedShare', args: [account] }),
    publicClient.readContract({ address, abi: poolStakesAbi, functionName: 'poolId' }),
    publicClient.readContract({ address, abi: poolStakesAbi, functionName: 'vestingPools' }),
    publicClient.getBlock(),
  ])

  const [allocated, released] = stake
  if (allocated === 0n) return null

  // Read the schedule from whatever THIS clone reports as its vesting source, at
  // its own poolId. Direct clone → the real VestingPools at the pool id; splitter-
  // backed clone → the SPLITTER at the child id (0), whose getPool mirrors the
  // parent's start/vestingDays. A fixed VestingPools + child id would read the
  // wrong pool's schedule.
  const pool = await publicClient.readContract({
    address: getAddress(vestingPoolsAddr),
    abi: vestingPoolsAbi,
    functionName: 'getPool',
    args: [BigInt(poolId)],
  })

  const start = Number(pool.start)
  const end = start + Number(pool.vestingDays) * 86_400
  // Gate on CHAIN time (block.timestamp), not the browser clock — it's what the
  // contract enforces for vesting, and keeps a time-warped fork claimable.
  const now = Number(block.timestamp)
  const vestedFraction = end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0

  return {
    clone,
    allocated,
    released,
    releasable,
    claimable: releasable + unclaimed,
    start,
    end,
    vestingDays: Number(pool.vestingDays),
    notStarted: now < start,
    vestedFraction,
  }
}

/** Resolve every clone the wallet belongs to (0, 1, or both). */
export async function resolveMemberships(holder: Hex): Promise<Position[]> {
  const results = await Promise.all(
    CLONES.map((c) => loadPosition(c, holder).catch(() => null)),
  )
  return results.filter((p): p is Position => p !== null)
}

/**
 * claimAndWithdraw() on one clone. Pulls newly vested tokens in and pays the
 * caller in a single legacy type-0 transaction (EIP-1559 fields are wrong on
 * Igra chains). Pre-checks the native balance so we never submit a transaction
 * that the RPC silently drops for insufficient gas.
 */
export async function claimAndWithdraw(wallet: WalletClient, clone: CloneInfo): Promise<Hash> {
  const account = wallet.account
  if (!account) throw new Error('Wallet is not connected.')

  const balance = await publicClient.getBalance({ address: account.address })
  if (balance < MIN_GAS_BALANCE) {
    throw new Error('Not enough iKAS for gas — fund this wallet and try again.')
  }

  return wallet.writeContract({
    account,
    chain,
    address: getAddress(clone.address),
    abi: poolStakesAbi,
    functionName: 'claimAndWithdraw',
    type: 'legacy',
    gas: TX_GAS_LIMIT,
    gasPrice: TX_GAS_PRICE,
  })
}

/**
 * Wait for a claim receipt. On Igra chains a dropped tx never mines (no revert,
 * no receipt), so we bound the wait and treat a timeout as a probable drop.
 */
export async function waitForClaim(hash: Hash) {
  return publicClient.waitForTransactionReceipt({ hash, timeout: 20_000 })
}

/** Turn a viem/contract error into human copy, mapping known reverts. */
export function describeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err)
  for (const [revert, message] of Object.entries(REVERT_MESSAGES)) {
    if (raw.includes(revert)) return message
  }
  if (/insufficient funds|not enough ikas|exceeds the balance/i.test(raw)) {
    return 'Not enough iKAS for gas — fund this wallet and try again.'
  }
  if (/timed out|not.*mined|receipt/i.test(raw)) {
    return 'The transaction did not confirm — it may have been dropped for gas. Check your balance and retry.'
  }
  if (/user rejected|denied|rejected the request/i.test(raw)) {
    return 'Transaction rejected in your wallet.'
  }
  return 'Something went wrong. Please try again.'
}

/** Format wei (18 dp) as a grouped, trimmed token amount, e.g. "5,000,000". */
export function formatToken(wei: bigint, maxFractionDigits = 4): string {
  const asString = formatUnits(wei, 18)
  const [intPart, fracPart = ''] = asString.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const frac = fracPart.replace(/0+$/, '').slice(0, maxFractionDigits)
  return frac ? `${grouped}.${frac}` : grouped
}

export function explorerTx(hash: string): string {
  return `${CHAIN.explorer}/tx/${hash}`
}

export function explorerAddress(addr: string): string {
  return `${CHAIN.explorer}/address/${addr}`
}
