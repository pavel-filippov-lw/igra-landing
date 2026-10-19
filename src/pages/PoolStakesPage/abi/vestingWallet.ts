/**
 * Minimal OpenZeppelin VestingWallet ABI (v5) — the ERC-20 overloads only.
 *
 * `owner()` is the beneficiary; `release(token)` is permissionless and always
 * pays the beneficiary. SuperOwnedVestingWallet (DAO grants) adds a
 * `forceTransferOwnership` the dapp never calls.
 */
export const vestingWalletAbi = [
  { type: 'function', name: 'owner', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
  { type: 'function', name: 'start', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'duration', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  {
    type: 'function',
    name: 'released',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'releasable',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'release',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [],
  },
] as const
