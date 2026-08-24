/**
 * Minimal VestingPools ABI — read-only for the dapp.
 *
 * getPool returns a 7-field struct; the dapp only needs `start` (uint32, unix
 * seconds) and `vestingDays` (uint16). Durations are NOT hardcoded — the test
 * compresses ~18 months into ~10 days, so always read them from chain.
 */
export const vestingPoolsAbi = [
  {
    type: 'function',
    name: 'getPool',
    stateMutability: 'view',
    inputs: [{ name: 'poolId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'isPreMinted', type: 'bool' },
          { name: 'isAdjustable', type: 'bool' },
          { name: 'start', type: 'uint32' },
          { name: 'vestingDays', type: 'uint16' },
          { name: 'sAllocation', type: 'uint64' },
          { name: 'sUnlocked', type: 'uint64' },
          { name: 'vested', type: 'uint96' },
        ],
      },
    ],
  },
] as const
