import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

import { CHAIN } from './constants'

/**
 * Reown AppKit setup for the PoolStakes vesting-claim dapp.
 *
 * Only Galleon Testnet (38836) is listed, so connecting enforces the right
 * network — writes must be legacy type-0 @ 2000 gwei, which only makes sense on
 * an Igra chain. This is a SEPARATE AppKit config from the Tangem giveaway page;
 * both are lazy-loaded, unlisted, single-purpose flows that a visitor is only
 * ever on one of at a time.
 *
 * Requires a free WalletConnect Cloud (Reown) projectId:
 *   VITE_WALLETCONNECT_PROJECT_ID=...
 * Without it, AppKit is not initialised and the page shows a "not configured"
 * guard (reads still work — they use the public RPC client, not the wallet).
 */

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const igraChain = defineChain({
  id: CHAIN.id,
  caipNetworkId: `eip155:${CHAIN.id}`,
  chainNamespace: 'eip155',
  name: CHAIN.name,
  nativeCurrency: { name: CHAIN.nativeSymbol, symbol: CHAIN.nativeSymbol, decimals: 18 },
  rpcUrls: {
    default: { http: [CHAIN.rpcUrl] },
  },
  blockExplorers: {
    default: { name: `${CHAIN.name} Explorer`, url: CHAIN.explorer },
  },
  testnet: true,
})

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [igraChain]

export const isAppKitConfigured = Boolean(projectId)

export const wagmiAdapter = projectId
  ? new WagmiAdapter({
      networks,
      projectId,
      ssr: false,
    })
  : null

export const wagmiConfig = wagmiAdapter?.wagmiConfig ?? null

let initialised = false

/** Initialise the AppKit modal singleton once. Idempotent; no-ops without config. */
export function initAppKit(): void {
  if (initialised || !projectId || !wagmiAdapter) return
  initialised = true
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata: {
      name: 'Igra PoolStakes',
      description: 'Claim your vested Igra allocation.',
      url: 'https://igralabs.com',
      icons: ['https://igralabs.com/favicon.ico'],
    },
    features: {
      analytics: false,
      email: false,
      socials: false,
    },
  })
}
