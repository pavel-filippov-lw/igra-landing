import { useAppKit } from '@reown/appkit/react'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { PageLayout } from '~/Components'
import { Button } from '~/shared/ui'

import { isAppKitConfigured } from './appkit'
import {
  buildSiweMessage,
  ClaimError,
  fetchEligibility,
  shortAddress,
  toChecksum,
  verifyClaim,
} from './claim'
import heroImg from './assets/hero-tight.png'
import { EmailRegister, RegisteredSuccess } from './EmailRegister'
import {
  GiveawayRules,
  GIVEAWAY_RULES_TITLE,
  PrivacyNotice,
  PRIVACY_NOTICE_TITLE,
} from './legalContent'
import { LegalModal } from './LegalModal'
import {
  clearClaimToken,
  getRegistration,
  isRegistered,
  loadClaimToken,
  markRegistered,
  resetPersistedState,
  saveClaimToken,
} from './storage'
import classes from './TangemClaimPage.module.scss'
import { TangemClaimProviders } from './TangemClaimProviders'

type Phase = 'connect' | 'verify' | 'done'

interface Verified {
  claimToken: string
  deadline?: string
}

// External GitHub link for the eligibility snapshot. Placeholder — replace with
// the real repo URL. (Rules + Privacy open in-page modals, see the footer.)
const ELIGIBILITY_SNAPSHOT_URL = 'https://github.com/IgraLabs/tangem-zap-giveaway-2026'

// The exact registration deadline, shown to the user verbatim.
const DEADLINE = '15 August 2026, 23:59 UTC'

const STEP_LABELS = ['Connect wallet', 'Confirm ownership', 'Verify email'] as const

/** Compact horizontal step tracker — always short, so the active step stays above the fold. */
const StepTracker: FC<{ current: number }> = ({ current }) => (
  <ol className={classes.tracker}>
    {STEP_LABELS.map((label, i) => {
      const state = i < current ? classes.trackerDone : i === current ? classes.trackerActive : classes.trackerPending
      return (
        <li key={label} className={`${classes.trackerStep} ${state}`}>
          <span className={classes.trackerDot}>{i < current ? '✓' : i + 1}</span>
          <span className={classes.trackerLabel}>{label}</span>
        </li>
      )
    })}
  </ol>
)

/**
 * Two-column page shell matching the Figma design: a large title + the claim
 * card on the left, and the hero illustration (open box with Tangem cards) on
 * the right. Renders no wagmi hooks, so it is safe even when WalletConnect is
 * not configured. Only the content relevant to the current phase is shown — the
 * intro/reassurance/privacy collapse once the user reaches the email step, so
 * the active step stays near the top. `stepIndex` drives the tracker (0/1/2).
 */
const ClaimShell: FC<{ phase: Phase; stepIndex: number; action: ReactNode; children?: ReactNode }> = ({
  phase,
  stepIndex,
  action,
  children,
}) => {
  const onboarding = phase === 'connect' || phase === 'verify'
  const [openDoc, setOpenDoc] = useState<'rules' | 'privacy' | null>(null)
  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <div className={classes.left}>
          <h1 className={classes.title}>Tangem × Igra Giveaway</h1>

          <div className={classes.card}>
            {onboarding && (
              <p className={classes.intro}>
                Bid at least 500 iKAS during ZAP? You’re in the draw for one of 10 Igra-themed
                Tangem 3-card sets.
                <br />
                Connect your wallet to check, and optionally add an email so we can notify if you win.
              </p>
            )}

            <StepTracker current={stepIndex} />

            {onboarding && (
              <p className={classes.reassure}>
                No transaction or gas fee is required. <strong>Never share your seed phrase.</strong>
              </p>
            )}

            {action}

            {children}

            {onboarding && (
              <p className={classes.privacy}>
                Your email will be used only for this giveaway — not for marketing — and deleted after
                the giveaway is completed. Registration confirms eligibility for notifications; winners
                will be selected separately through a publicly verifiable draw.
              </p>
            )}
          </div>

          <nav className={classes.footerLinks} aria-label="Giveaway documents">
            <a href={ELIGIBILITY_SNAPSHOT_URL} target="_blank" rel="noopener noreferrer">
              Eligibility snapshot
            </a>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setOpenDoc('rules')}>
              Giveaway rules
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setOpenDoc('privacy')}>
              Privacy notice
            </button>
          </nav>
        </div>

        <div className={classes.hero} aria-hidden="true">
          <img src={heroImg} alt="" className={classes.heroImg} />
        </div>
      </div>

      {openDoc === 'rules' && (
        <LegalModal title={GIVEAWAY_RULES_TITLE} onClose={() => setOpenDoc(null)}>
          <GiveawayRules />
        </LegalModal>
      )}
      {openDoc === 'privacy' && (
        <LegalModal title={PRIVACY_NOTICE_TITLE} onClose={() => setOpenDoc(null)}>
          <PrivacyNotice />
        </LegalModal>
      )}
    </div>
  )
}

/** Interactive claim flow. Uses wagmi/AppKit hooks — must be inside providers. */
const TangemClaimInner: FC = () => {
  const { address: rawAddress, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { open } = useAppKit()

  const [verified, setVerified] = useState<Verified | null>(null)
  const [registered, setRegistered] = useState(false)
  const [ineligible, setIneligible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const address = rawAddress ? toChecksum(rawAddress) : undefined
  const phase: Phase = verified || registered ? 'done' : isConnected ? 'verify' : 'connect'

  /**
   * Dev/testing escape hatch: visiting `/tangem-claim?reset` wipes persisted
   * claim state (token + registration flag) and disconnects the wallet, so the
   * full flow can be re-run from scratch. The param is stripped afterwards so a
   * plain refresh doesn't keep resetting.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('reset')) return
    resetPersistedState()
    setVerified(null)
    setRegistered(false)
    setIneligible(false)
    setError(null)
    void disconnectAsync().catch(() => {})
    params.delete('reset')
    const qs = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * When a wallet becomes connected, restore any persisted state for it so the
   * user skips steps they already completed:
   *  - already registered → jump to the success screen (no sign, no re-register)
   *  - a still-valid claimToken → jump to the email step (no re-sign)
   */
  useEffect(() => {
    // Any address change (connect, disconnect, or switch) starts fresh: clear
    // transient flags so e.g. the "not eligible" notice doesn't linger after a
    // disconnect or when connecting a different wallet.
    setIneligible(false)
    setError(null)
    if (!address) {
      setVerified(null)
      setRegistered(false)
      return
    }
    if (isRegistered(address)) {
      setRegistered(true)
      return
    }
    setRegistered(false)
    const stored = loadClaimToken(address, Date.now())
    setVerified(stored ? { claimToken: stored.claimToken, deadline: stored.deadline } : null)
  }, [address])

  const handleError = (err: unknown) => {
    setError(err instanceof ClaimError ? err.message : 'Something went wrong. Please try again.')
  }

  /** Open the AppKit modal (QR for Tangem on desktop, deep-link on mobile). */
  const handleConnect = () => {
    setError(null)
    void open()
  }

  /** Eligibility → SIWE sign → server verify → claim token. */
  const handleVerify = async () => {
    if (!address) return
    setError(null)
    setBusy(true)
    try {
      const { eligible, nonce, deadline } = await fetchEligibility(address)
      if (!eligible) {
        setIneligible(true)
        return
      }

      const issuedAt = new Date().toISOString()
      const message = buildSiweMessage(address, nonce, issuedAt)

      let signature: `0x${string}`
      try {
        signature = await signMessageAsync({ account: address, message })
      } catch {
        throw new ClaimError('Signature was rejected. You must sign the message to verify ownership.', 'wallet')
      }

      const { claimToken } = await verifyClaim(address, message, signature)
      saveClaimToken(address, claimToken, deadline, Date.now())
      setVerified({ claimToken, deadline })
    } catch (err) {
      handleError(err)
    } finally {
      setBusy(false)
    }
  }

  const useDifferentWallet = async () => {
    setError(null)
    setIneligible(false)
    setVerified(null)
    setRegistered(false)
    clearClaimToken()
    try {
      await disconnectAsync()
    } catch {
      /* ignore */
    }
  }

  const action = (
    <>
      {phase === 'connect' && (
        <Button variant="primary" onClick={handleConnect} className={classes.cta}>
          Connect wallet
        </Button>
      )}

      {phase === 'verify' && !ineligible && (
        <Button
          variant="primary"
          onClick={() => void handleVerify()}
          disabled={busy}
          className={classes.cta}
        >
          {busy ? 'Check your wallet…' : 'Sign to verify ownership'}
        </Button>
      )}

      {address && phase !== 'done' && (
        <p className={classes.connected}>
          Wallet: <span className={classes.address}>{shortAddress(address)}</span>
          <button type="button" className={classes.linkInline} onClick={() => void useDifferentWallet()}>
            change
          </button>
        </p>
      )}

      {ineligible && (
        <div className={classes.notice}>
          <p>
            This wallet doesn’t meet the published eligibility criteria (≥500&nbsp;iKAS gross bids).
            If you used a different wallet for ZAP, connect that one instead.
          </p>
          <button type="button" className={classes.linkButton} onClick={() => void useDifferentWallet()}>
            Try a different wallet
          </button>
        </div>
      )}

      {error && <p className={classes.error}>{error}</p>}
    </>
  )

  const onRegistered = (maskedEmail: string) => {
    if (address) markRegistered(address, maskedEmail)
    setRegistered(true)
    clearClaimToken()
  }

  // The claimToken expired mid-registration — drop it and return to the sign
  // step (wallet stays connected), with a note explaining why.
  const onSessionExpired = () => {
    clearClaimToken()
    setVerified(null)
    setError('Your session expired. Please sign again to continue.')
  }

  // 0 connect, 1 verify, 2 on the email step, 3 = all done (every dot checked).
  const stepIndex = registered ? 3 : phase === 'connect' ? 0 : phase === 'verify' ? 1 : 2
  const shortWallet = address ? shortAddress(address) : undefined
  // For a returning registered wallet, pull the masked email persisted earlier.
  const storedMaskedEmail = address ? getRegistration(address)?.maskedEmail : undefined

  return (
    <ClaimShell phase={phase} stepIndex={stepIndex} action={action}>
      {phase === 'done' &&
        (registered ? (
          <RegisteredSuccess
            deadline={DEADLINE}
            shortWallet={shortWallet}
            maskedEmail={storedMaskedEmail}
            onRegisterAnother={() => void useDifferentWallet()}
          />
        ) : (
          verified && (
            <EmailRegister
              claimToken={verified.claimToken}
              deadline={DEADLINE}
              shortWallet={shortWallet}
              onRegistered={onRegistered}
              onSessionExpired={onSessionExpired}
            />
          )
        ))}
    </ClaimShell>
  )
}

export const TangemClaimPage: FC = () => (
  <PageLayout hideBg>
    {isAppKitConfigured ? (
      <TangemClaimProviders>
        <TangemClaimInner />
      </TangemClaimProviders>
    ) : (
      <ClaimShell
        phase="connect"
        stepIndex={0}
        action={
          <p className={classes.error}>
            Wallet connection is not configured yet. Please check back soon.
          </p>
        }
      />
    )}
  </PageLayout>
)
