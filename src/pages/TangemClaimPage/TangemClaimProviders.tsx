import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'

import { initAppKit, isAppKitConfigured, wagmiConfig } from './appkit'

/**
 * Wraps the giveaway page with the wagmi + react-query providers AppKit needs.
 *
 * This deliberately lives INSIDE the lazy-loaded giveaway page (not in the app
 * root) so the WalletConnect/AppKit stack is code-split away from the main
 * landing bundle — visitors only download it when they open /tangem-claim.
 *
 * When WalletConnect is not configured (no projectId), we render children without
 * providers; the page's own guard shows a "not configured" message.
 */
export const TangemClaimProviders: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useMemo(() => new QueryClient(), [])

  if (!isAppKitConfigured || !wagmiConfig) {
    return <>{children}</>
  }

  // Register the AppKit modal singleton once, on first render of this route.
  initAppKit()

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
