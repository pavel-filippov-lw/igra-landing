import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { defineChain, mainnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

/**
 * Reown AppKit (Web3Modal successor) setup for the Tangem × Igra giveaway.
 *
 * WalletConnect is required here: Tangem is a WalletConnect-only wallet (no
 * browser extension, no in-app dApp browser), so injected-only connection would
 * exclude the giveaway's core audience. AppKit gives Tangem users a QR on desktop
 * and native deep-links on mobile, while still supporting injected wallets.
 *
 * A free WalletConnect Cloud (Reown) projectId is required:
 *   VITE_WALLETCONNECT_PROJECT_ID=...
 * Without it, AppKit is not initialised and the page shows a "not configured"
 * guard instead of a broken connect button.
 */

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

/**
 * Igra Mainnet. Values are from the official docs (Network Info):
 * https://igra-labs.gitbook.io/igralabs-docs/quickstart/network-info
 * chainId 38833 (0x97B1), native currency iKAS (18 decimals). ZAP participants'
 * wallets live on this chain, so it is listed first (the default network).
 */
export const igraMainnet = defineChain({
  id: 38833,
  caipNetworkId: 'eip155:38833',
  chainNamespace: 'eip155',
  name: 'Igra Mainnet',
  nativeCurrency: { name: 'iKAS', symbol: 'iKAS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.igralabs.com:8545'], webSocket: ['wss://rpc.igralabs.com:8545'] },
  },
  blockExplorers: {
    default: { name: 'Igra Explorer', url: 'https://explorer.igralabs.com' },
  },
})

/**
 * Networks the giveaway wallet may be on. Igra Mainnet is primary (ZAP wallets
 * are there); Ethereum is also accepted since eligibility is proven by a
 * chain-agnostic SIWE signature — users are never forced to switch chains.
 */
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [igraMainnet, mainnet]

export const isAppKitConfigured = Boolean(projectId)

/**
 * The wagmi adapter/config. Created only when a projectId is present. Consumers
 * must null-check (or gate on `isAppKitConfigured`) before use.
 */
export const wagmiAdapter = projectId
  ? new WagmiAdapter({
      networks,
      projectId,
      ssr: false,
    })
  : null

export const wagmiConfig = wagmiAdapter?.wagmiConfig ?? null

let initialised = false

/**
 * Initialise the AppKit singleton (registers the <appkit> web components and the
 * modal). Idempotent and safe to call from module scope; no-ops without config.
 */
export function initAppKit(): void {
  if (initialised || !projectId || !wagmiAdapter) return
  initialised = true
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata: {
      name: 'Tangem × Igra Giveaway',
      description: 'Verify your wallet to register for the Tangem × Igra giveaway.',
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
