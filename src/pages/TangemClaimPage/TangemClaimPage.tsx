import { FC } from 'react'

import { PageLayout } from '~/Components'

import { isAppKitConfigured } from './appkit'
import { ClaimFrame } from './ClaimFrame'
import classes from './TangemClaimPage.module.scss'
import { TangemClaimProviders } from './TangemClaimProviders'
import { WinnerFlow } from './WinnerFlow'

/**
 * Igra × Tangem Giveaway — winners' claim page.
 *
 * The draw is complete. A winner connects the wallet they used during ZAP,
 * checks winner status, proves control of the wallet with a gas-free signature,
 * and submits delivery details. Wired to the live giveaway API
 * (winner-status → verify → email OTP → claim; see claim.ts).
 *
 * The interactive flow needs WalletConnect config (VITE_WALLETCONNECT_PROJECT_ID);
 * without it we show a guard instead of a broken connect button.
 */
export const TangemClaimPage: FC = () => (
  <PageLayout hideBg>
    {isAppKitConfigured ? (
      <TangemClaimProviders>
        <WinnerFlow />
      </TangemClaimProviders>
    ) : (
      <ClaimFrame>
        <p className={classes.error}>
          Wallet connection is not configured yet. Please check back soon.
        </p>
      </ClaimFrame>
    )}
  </PageLayout>
)
