/**
 * IGRA PoolStakes vesting-claim dapp — chain + contract config.
 *
 * Two network profiles, selected by `VITE_POOLSTAKES_NETWORK` (default 'galleon'):
 *  - 'galleon': the Galleon testnet sandbox (chainId 38836, tIGRA test token).
 *  - 'fork':    a LOCAL anvil fork of Igra mainnet (chainId 138833, real IGRA), for
 *               testing the claim UI against mainnet contracts. Dev-only; nothing
 *               real is touched. See the fork runbook.
 *
 * Galleon addresses were verified live (chainId 38836). The fork's pool #7 clone
 * is the real mainnet Round 1 (contributor) distributor — a PoolStakes clone behind a
 * VestingPoolSplitter, so its poolId() is the CHILD id (0) and its vestingPools()
 * is the splitter, not the real VestingPools (the schedule is read per-clone).
 */

export type Hex = `0x${string}`

export interface CloneInfo {
  key: 'round1' | 'team'
  name: string
  /** The distributor clone the dapp reads/writes. */
  address: Hex
  /**
   * The clone's own pool id — for a splitter-backed clone this is the CHILD id
   * (e.g. 0), NOT the parent VestingPools pool id. Re-read from chain at runtime;
   * the schedule is read from whatever the clone reports as `vestingPools()`.
   */
  poolId: number
  /** Deployment block (fromBlock for any log query). Unused today; 0 is fine. */
  fromBlock: bigint
  dynamic: boolean
  blurb: string
}

export interface NetworkConfig {
  id: number
  name: string
  rpcUrl: string
  explorer: string
  nativeSymbol: string
  /** Display symbol of the vested token (tIGRA on Galleon, IGRA on mainnet/fork). */
  tokenSymbol: string
  token: Hex
  clones: CloneInfo[]
  testnet: boolean
  /** Legacy type-0 gas limit for a claim write (per network). */
  txGasLimit: bigint
}

const galleon: NetworkConfig = {
  id: 38836,
  name: 'Galleon Testnet',
  rpcUrl: 'https://galleon-testnet.igralabs.com:8545', // port 8545 required on Igra RPCs
  explorer: 'https://explorer.galleon.igralabs.com',
  nativeSymbol: 'iKAS',
  tokenSymbol: 'tIGRA',
  token: '0x6B44D6D1d51C6b9507A2245CdEf1d1ABf6b61F38',
  testnet: true,
  txGasLimit: 300_000n,
  clones: [
    {
      key: 'round1',
      name: 'Round 1',
      address: '0xC0000B4fdc1e28d6faD4FEC21c8640449402c738',
      poolId: 0,
      fromBlock: 17075306n,
      dynamic: false,
      blurb: 'Early contributors — contractual terms, frozen for the life of the vest.',
    },
    {
      key: 'team',
      name: 'Team & Angels',
      address: '0xF7bDeF593A8761C4f0c129Ab10812D6AE75321a3',
      poolId: 1,
      fromBlock: 17075309n,
      dynamic: true,
      blurb: 'Contributors — allocations can be raised and new members added over time.',
    },
  ],
}

/**
 * LOCAL anvil fork of Igra mainnet. Start it with its OWN chainId so it doesn't
 * clash with the real 38833 in your wallet:
 *   anvil --fork-url https://rpc.igralabs.com:8545 --port 8546 --chain-id 138833 --no-rate-limit
 * Add a matching "Igra Fork" network to your wallet (RPC http://127.0.0.1:8546,
 * chainId 138833). See the fork runbook for seeding a stake + fast-forwarding time.
 * The splitter claim path costs more gas than a direct clone, so the limit is
 * higher; anvil prices gas normally (no silent-drop trap), so the balance guard
 * is nominal — the anvil test account is funded.
 */
const fork: NetworkConfig = {
  id: 138833,
  name: 'Igra Fork (local)',
  rpcUrl: 'http://127.0.0.1:8546',
  explorer: 'https://explorer.igralabs.com',
  nativeSymbol: 'iKAS',
  tokenSymbol: 'IGRA',
  token: '0x093d77d397F8acCbaee0820345E9E700B1233cD1', // real IGRA
  testnet: true,
  txGasLimit: 1_000_000n,
  clones: [
    {
      key: 'round1',
      name: 'Round 1 (contributors)',
      address: '0xf8A15e869F8327fe7af0538F5fB07312CF37DDCf', // pool #7 Round 1 distributor (behind the splitter)
      poolId: 0, // CHILD id, not pool #7
      fromBlock: 0n,
      dynamic: false,
      blurb: 'Round 1 contributors — vesting distributor for pool #7.',
    },
  ],
}

const PROFILES = { galleon, fork } as const
type ProfileName = keyof typeof PROFILES

const selected = (import.meta.env.VITE_POOLSTAKES_NETWORK as ProfileName | undefined) ?? 'galleon'

/** Active network profile (Galleon unless VITE_POOLSTAKES_NETWORK=fork). */
export const NETWORK: NetworkConfig = PROFILES[selected] ?? galleon

/** Convenience view of the active profile's chain fields. */
export const CHAIN = {
  id: NETWORK.id,
  name: NETWORK.name,
  rpcUrl: NETWORK.rpcUrl,
  explorer: NETWORK.explorer,
  nativeSymbol: NETWORK.nativeSymbol,
  testnet: NETWORK.testnet,
}

export const TOKEN: Hex = NETWORK.token
export const TOKEN_SYMBOL = NETWORK.tokenSymbol
export const CLONES: CloneInfo[] = NETWORK.clones

/**
 * Legacy type-0 gas price for Igra chains — the RPC's EIP-1559 fields are wrong
 * and produce dropped/underpriced txs. (Harmless on an anvil fork, which prices
 * gas normally.) Gas limit + balance guard are per-network (see NetworkConfig).
 */
export const TX_GAS_PRICE = 2_000_000_000_000n // 2000 gwei
export const TX_GAS_LIMIT = NETWORK.txGasLimit
/**
 * Native balance required before a write. Igra's silent-drop trap fires when
 * `gasLimit × gasPrice` EXCEEDS the sender's balance (the RPC accepts the tx then
 * never mines it, no revert), so the guard must be the FULL `gasLimit × gasPrice`
 * — not a lower "typical cost" figure, or a wallet in between passes the check and
 * the claim silently vanishes.
 */
export const MIN_GAS_BALANCE = TX_GAS_LIMIT * TX_GAS_PRICE

/** Human revert-string → user-facing copy. */
export const REVERT_MESSAGES: Record<string, string> = {
  'PStakes: unknown stake': 'This wallet has no allocation in that pool.',
  'PStakes: nothing to withdraw': 'Nothing to claim yet.',
}
