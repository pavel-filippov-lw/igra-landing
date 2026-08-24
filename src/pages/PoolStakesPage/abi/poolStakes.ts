/**
 * Minimal PoolStakes (clone) ABI — only the members the dapp uses.
 *
 * Bound to the ABI generated from LIVE Galleon chain state (PoolStakes testing
 * hand-off §10.1), NOT the local igra-core-contracts build: that compiled output
 * is stale and is missing the `StakeIncreased` event the deployed clones emit.
 *
 * `as const` preserves literal types so viem infers return types precisely
 * (uint96/uint256 → bigint, uint16/uint32 → number).
 */
export const poolStakesAbi = [
  // --- reads ---
  {
    type: 'function',
    name: 'stakes',
    stateMutability: 'view',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [
      { name: 'allocated', type: 'uint96' },
      { name: 'released', type: 'uint96' },
    ],
  },
  {
    type: 'function',
    name: 'releasableAmount',
    stateMutability: 'view',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'unclaimedShare',
    stateMutability: 'view',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'poolId',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint16' }],
  },
  {
    // The vesting source this clone reads from. For a splitter-backed clone this
    // is the VestingPoolSplitter (whose getPool(childId) mirrors the parent
    // schedule), not the real VestingPools — so read the schedule from here.
    type: 'function',
    name: 'vestingPools',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
  {
    type: 'function',
    name: 'allocation',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
  {
    type: 'function',
    name: 'allocated',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
  {
    type: 'function',
    name: 'released',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint96' }],
  },
  {
    type: 'function',
    name: 'factor',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint160' }],
  },
  // --- writes (stakeholder) ---
  {
    type: 'function',
    name: 'claimAndWithdraw',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimVesting',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdraw',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'splitStake',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'newHolder', type: 'address' },
      { name: 'newAmount', type: 'uint256' },
    ],
    outputs: [],
  },
  // --- events ---
  {
    type: 'event',
    name: 'StakeAdded',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'allocated', type: 'uint256', indexed: false },
    ],
  },
  {
    // Raise. NOTE: `allocated` is the NEW TOTAL, not the delta added.
    type: 'event',
    name: 'StakeIncreased',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'allocated', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'StakeSplit',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'allocated', type: 'uint256', indexed: false },
      { name: 'released', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Released',
    inputs: [
      { name: 'holder', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    // Someone pulled vested tokens in → factor moved → everyone's releasable changed.
    type: 'event',
    name: 'VestingClaimed',
    inputs: [{ name: 'amount', type: 'uint256', indexed: false }],
  },
] as const
