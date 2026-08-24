import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'

import { initAppKit, isAppKitConfigured, wagmiConfig } from './appkit'

/**
 * Wraps the PoolStakes dapp with the wagmi + react-query providers AppKit needs.
 *
 * Lives INSIDE the lazy-loaded route (not the app root) so the WalletConnect /
 * AppKit stack is code-split away from the main landing bundle.
 *
 * When WalletConnect is not configured, children render without providers; the
 * page's guard shows a "connect not configured" note, and read-only data still
 * works because it uses the public RPC client rather than the wallet.
 */
export const PoolStakesProviders: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  if (!isAppKitConfigured || !wagmiConfig) {
    return <>{children}</>
  }

  initAppKit()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
