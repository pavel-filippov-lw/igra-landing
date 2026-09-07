import { useAppKit } from '@reown/appkit/react'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import type { Address } from 'viem'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { Button } from '~/shared/ui'

import {
  buildSiweMessage,
  ClaimError,
  ClaimResult,
  fetchWinnerStatus,
  shortAddress,
  toChecksum,
  verifyClaim,
  WINNER_SIWE_STATEMENT,
  WinnerSelected,
} from './claim'
import { ClaimFrame } from './ClaimFrame'
import { Countdown } from './Countdown'
import { ShippingForm } from './ShippingForm'
import classes from './TangemClaimPage.module.scss'
import { fetchWinners, Winner } from './winners'

const REPRODUCE_URL =
  'https://github.com/IgraLabs/tangem-zap-giveaway-2026/blob/draw-v1.2/REPRODUCE.md'
// Round 2 audit record — set to the published URL when available; the link is
// hidden while this is empty.
const ROUND2_AUDIT_URL: string = ''
const CONTACT_EMAIL = 'giveaway@igra.network'

/** ISO → "7 September 2026, 18:00 UTC" (always UTC). */
function formatDeadline(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const s = d.toLocaleString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${s} UTC`
}

/** ISO → "2026-08-24 10:02:21 UTC". */
function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '') + ' UTC'
}

/** A rank + shortened-address row list, reused across the winner groups. */
const WinnerRows: FC<{ rows: Winner[] }> = ({ rows }) => (
  <ul className={classes.winnersList}>
    {rows.map((w) => (
      <li key={w.rank}>
        <span className={classes.winnerRank}>#{w.rank}</span>
        <code>{w.short}</code>
      </li>
    ))}
  </ul>
)

/** Interactive winners' claim flow. Uses wagmi/AppKit hooks — must be inside providers. */
export const WinnerFlow: FC = () => {
  const { address: rawAddress, isConnected } = useAccount()
  const address = rawAddress ? toChecksum(rawAddress) : undefined
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { open } = useAppKit()

  const [winners, setWinners] = useState<Winner[]>([])
  const [status, setStatus] = useState<WinnerSelected | null>(null)
  const [notSelected, setNotSelected] = useState(false)
  const [checking, setChecking] = useState(false)
  const [claimToken, setClaimToken] = useState<string | null>(null)
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [closed, setClosed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchWinners().then(setWinners)
  }, [])

  const loadStatus = useCallback(async (addr: Address) => {
    setChecking(true)
    setError(null)
    setStatus(null)
    setNotSelected(false)
    setClaimToken(null)
    setClaimResult(null)
    setSubmittedEmail(null)
    setClosed(false)
    try {
      const s = await fetchWinnerStatus(addr)
      if (s.selected) {
        setStatus(s)
        if (s.claimDeadlineAt && Date.parse(s.claimDeadlineAt) <= Date.parse(s.serverTime)) {
          setClosed(true)
        }
      } else {
        setNotSelected(true)
      }
    } catch (err) {
      setError(err instanceof ClaimError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    if (!address) {
      setStatus(null)
      setNotSelected(false)
      setClaimToken(null)
      setClaimResult(null)
      setSubmittedEmail(null)
      setError(null)
      return
    }
    void loadStatus(address)
  }, [address, loadStatus])

  const handleConnect = () => {
    setError(null)
    void open()
  }

  const checkAnother = async () => {
    setError(null)
    setStatus(null)
    setNotSelected(false)
    setClaimToken(null)
    setClaimResult(null)
    try {
      await disconnectAsync()
    } catch {
      /* ignore */
    }
    void open()
  }

  const refreshNonce = async () => {
    if (!address) return
    try {
      const s = await fetchWinnerStatus(address)
      if (s.selected) setStatus(s)
    } catch {
      /* ignore */
    }
  }

  const handleSign = async () => {
    if (!address || !status) return
    if (!status.nonce) {
      await refreshNonce()
      return
    }
    setBusy(true)
    setError(null)
    try {
      const issuedAt = new Date().toISOString()
      const message = buildSiweMessage(address, status.nonce, issuedAt, WINNER_SIWE_STATEMENT)
      let signature: `0x${string}`
      try {
        signature = await signMessageAsync({ account: address, message })
      } catch {
        throw new ClaimError(
          'Signature was rejected. You must sign to verify control of this wallet.',
          'wallet',
        )
      }
      const { claimToken: token } = await verifyClaim(address, message, signature)
      setClaimToken(token)
    } catch (err) {
      setError(err instanceof ClaimError ? err.message : 'Something went wrong. Please try again.')
      // Refresh the nonce so a retry starts clean (the previous one may be spent/expired).
      if (!(err instanceof ClaimError) || err.kind !== 'wallet') void refreshNonce()
    } finally {
      setBusy(false)
    }
  }

  const onSubmitted = (result: ClaimResult, email: string) => {
    setClaimResult(result)
    setSubmittedEmail(email)
  }

  const onSessionExpired = () => {
    setClaimToken(null)
    setError('Your session expired. Please sign again to continue.')
    void refreshNonce()
  }

  const shortWallet = address ? shortAddress(address) : ''

  // Winners grouped for the connect screen. Derived from the API (round + status)
  // so the groups and the progress count stay correct as Round 2 wallets claim.
  const claimedWinners = winners.filter((w) => w.status === 'claimed')
  const roundTwoWinners = winners.filter((w) => w.round === 2 && w.status !== 'claimed')
  const expiredWinners = winners.filter((w) => w.round === 1 && w.status === 'expired')
  const totalPrizes = winners.filter((w) => w.round === 1).length || 10

  // ---- Screen selection ----
  let body: ReactNode

  if (!isConnected || !address) {
    body = (
      <>
        <p className={classes.drawHeadline}>Round 2 claims are open</p>
        <p className={classes.drawText}>
          10 winning wallets were selected from 346 eligible ZAP wallets. Connect the wallet you
          used during ZAP to check and claim.
        </p>
        <p className={classes.drawDeadline}>Claims close 14 September 2026, 18:00 UTC</p>

        <Button variant="primary" onClick={handleConnect} className={classes.cta}>
          Connect wallet to check and claim
        </Button>
        <p className={classes.securityLine}>
          Checking and claiming require only a gas-free signature. No transaction, approval or
          payment is required.
        </p>
        {error && <p className={classes.error}>{error}</p>}

        <div className={classes.winners}>
          <h3 className={classes.winnersTitle}>Winning wallets</h3>
          {winners.length > 0 && (
            <p className={classes.winnersProgress}>
              <strong>{claimedWinners.length}</strong> of {totalPrizes} prizes claimed
            </p>
          )}

          {claimedWinners.length > 0 && (
            <div className={classes.winnerGroup}>
              <p className={classes.winnerGroupLabel}>Claimed</p>
              <WinnerRows rows={claimedWinners} />
            </div>
          )}

          {roundTwoWinners.length > 0 && (
            <div className={classes.winnerGroup}>
              <p className={classes.winnerGroupLabel}>Round 2 selected</p>
              <WinnerRows rows={roundTwoWinners} />
            </div>
          )}

          {expiredWinners.length > 0 && (
            <details className={classes.previousRound}>
              <summary>Previous round ({expiredWinners.length})</summary>
              <WinnerRows rows={expiredWinners} />
            </details>
          )}

          <div className={classes.verifyLinks}>
            <a className={classes.verifyLink} href={REPRODUCE_URL} target="_blank" rel="noopener noreferrer">
              Verify draw and reserve order →
            </a>
            {ROUND2_AUDIT_URL && (
              <a className={classes.verifyLink} href={ROUND2_AUDIT_URL} target="_blank" rel="noopener noreferrer">
                View Round 2 audit record →
              </a>
            )}
          </div>
        </div>
      </>
    )
  } else if (checking) {
    body = <p className={classes.drawText}>Checking this wallet…</p>
  } else if (claimResult) {
    body = (
      <>
        <div className={classes.successHead}>
          <div className={classes.successMark}>✓</div>
          <h2 className={classes.screenTitle}>Claim received</h2>
        </div>
        <p className={classes.drawText}>
          Your delivery details were submitted successfully. We will email you after verification.
        </p>
        <dl className={classes.meta}>
          <div className={classes.metaRow}>
            <dt>Claim reference</dt>
            <dd>{claimResult.claimRef}</dd>
          </div>
          {status && (
            <div className={classes.metaRow}>
              <dt>Draw rank</dt>
              <dd>#{status.rank}</dd>
            </div>
          )}
          <div className={classes.metaRow}>
            <dt>Wallet</dt>
            <dd className={classes.address}>{shortWallet}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Submitted</dt>
            <dd>{formatTimestamp(claimResult.claimedAt)}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Status</dt>
            <dd>Under review</dd>
          </div>
          {submittedEmail && (
            <div className={classes.metaRow}>
              <dt>Email</dt>
              <dd>{submittedEmail}</dd>
            </div>
          )}
        </dl>
        <p className={classes.contact}>
          Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </>
    )
  } else if (claimToken && status) {
    body = (
      <ShippingForm
        claimToken={claimToken}
        registeredEmail={status.registeredEmail}
        deadlineLabel={formatDeadline(status.claimDeadlineAt)}
        closed={closed}
        onSubmitted={onSubmitted}
        onSessionExpired={onSessionExpired}
      />
    )
  } else if (status && status.claimStatus === 'unclaimed') {
    body = (
      <>
        <div className={classes.wonHead}>
          <div className={classes.wonMark}>★</div>
          <h2 className={classes.screenTitle}>You won</h2>
        </div>
        <dl className={classes.meta}>
          <div className={classes.metaRow}>
            <dt>Draw rank</dt>
            <dd>#{status.rank}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Wallet</dt>
            <dd className={classes.address}>{shortWallet}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Claim deadline</dt>
            <dd>{formatDeadline(status.claimDeadlineAt)}</dd>
          </div>
          {status.claimDeadlineAt && (
            <div className={classes.metaRow}>
              <dt>Time left</dt>
              <dd>
                <Countdown
                  deadlineIso={status.claimDeadlineAt}
                  serverTimeIso={status.serverTime}
                  onExpire={() => setClosed(true)}
                />
              </dd>
            </div>
          )}
        </dl>

        {closed ? (
          <p className={classes.closedNotice}>
            The initial claim period closed on {formatDeadline(status.claimDeadlineAt)}.
          </p>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={() => void handleSign()}
              disabled={busy}
              className={classes.cta}
            >
              {busy ? 'Check your wallet…' : 'Sign to verify wallet'}
            </Button>
            <p className={classes.securityLine}>
              A gas-free signature — no transaction, approval or payment.
            </p>
          </>
        )}
        <p className={classes.connectedRow}>
          <button type="button" className={classes.linkInline} onClick={() => void checkAnother()}>
            Use a different wallet
          </button>
        </p>
        {error && <p className={classes.error}>{error}</p>}
      </>
    )
  } else if (status) {
    // Already claimed (returning winner).
    body = (
      <>
        <div className={classes.successHead}>
          <div className={classes.successMark}>✓</div>
          <h2 className={classes.screenTitle}>Claim received — under review</h2>
        </div>
        <p className={classes.drawText}>
          This wallet’s claim is in. We’ll email you after verification.
        </p>
        <dl className={classes.meta}>
          {status.claimRef && (
            <div className={classes.metaRow}>
              <dt>Claim reference</dt>
              <dd>{status.claimRef}</dd>
            </div>
          )}
          <div className={classes.metaRow}>
            <dt>Draw rank</dt>
            <dd>#{status.rank}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Wallet</dt>
            <dd className={classes.address}>{shortWallet}</dd>
          </div>
          {status.claimedAt && (
            <div className={classes.metaRow}>
              <dt>Submitted</dt>
              <dd>{formatTimestamp(status.claimedAt)}</dd>
            </div>
          )}
        </dl>
        {status.trackingUrl && (
          <p>
            <a
              className={classes.verifyLink}
              href={status.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Track your shipment →
            </a>
          </p>
        )}
        <p className={classes.contact}>
          Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p className={classes.connectedRow}>
          <button type="button" className={classes.linkInline} onClick={() => void checkAnother()}>
            Use a different wallet
          </button>
        </p>
      </>
    )
  } else if (notSelected) {
    body = (
      <>
        <h2 className={classes.screenTitle}>This wallet was not selected</h2>
        <p className={classes.drawText}>
          If you participated using another wallet, connect that wallet to check.
        </p>
        <p className={classes.connectedRow}>
          Wallet: <span className={classes.address}>{shortWallet}</span>
        </p>
        <Button variant="primary" onClick={() => void checkAnother()} className={classes.cta}>
          Check another wallet
        </Button>
        {error && <p className={classes.error}>{error}</p>}
      </>
    )
  } else {
    // Connected, no result yet, not checking (e.g. an error during load).
    body = (
      <>
        <p className={classes.drawText}>Checking this wallet…</p>
        {error && <p className={classes.error}>{error}</p>}
      </>
    )
  }

  return <ClaimFrame>{body}</ClaimFrame>
}
