import { useAppKit } from '@reown/appkit/react'
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import type { Address } from 'viem'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

import { Button } from '~/shared/ui'

import {
  buildSiweMessage,
  ClaimError,
  ClaimResult,
  fetchReserveStatus,
  fetchReserveWindow,
  fetchWinnerStatus,
  ReserveSubmitResult,
  shortAddress,
  submitReserve,
  toChecksum,
  verifyClaim,
  WINNER_SIWE_STATEMENT,
  WinnerSelected,
} from './claim'
import { ClaimFrame, useLegalDocs } from './ClaimFrame'
import { Countdown } from './Countdown'
import { FINAL_WINDOW_ANCHOR } from './legalContent'
import {
  RESERVE_SIWE_STATEMENT,
  ReserveInDraw,
  ReserveWindow,
  resolveLandingHero,
  resolveReserveScreen,
} from './reserve'
import { ShippingForm } from './ShippingForm'
import classes from './TangemClaimPage.module.scss'
import { fetchWinners, Winner } from './winners'

const REPRODUCE_URL =
  'https://github.com/IgraLabs/tangem-zap-giveaway-2026/blob/draw-v1.2/REPRODUCE.md'
const CONTACT_EMAIL = 'giveaway@igra.network'

// Final reserve window copy (FRONTEND-BRIEF-final-reserve-window.md §4). The
// organizer's addendum wording wins where it differs.
const SAFETY_LINE = 'No transaction, token approval or payment is required. Never share your seed phrase.'
const NO_GUARANTEE = 'I understand that this submission does not guarantee a prize.'
const RESUBMIT_NOTE = 'Submitting again replaces your previous details.'
const SUBMISSIONS_CLOSED = 'Submissions are closed'

/** ISO → "14 September 2026, 18:00 UTC" (always UTC). */
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

/** "Up to 5 prizes remain. " — only ever from the API's live count, never a static number. */
function prizesLine(n: number | null): string {
  if (n === null) return ''
  return `Up to ${n} prize${n === 1 ? '' : 's'} remain. `
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

/** Opens the Rules modal at the final-window addendum. Must render inside ClaimFrame. */
const FinalWindowRulesLink: FC = () => {
  const { openRules } = useLegalDocs()
  return (
    <button type="button" className={classes.verifyLink} onClick={() => openRules(FINAL_WINDOW_ANCHOR)}>
      Final-window rules →
    </button>
  )
}

/** Landing links (§4.1): rules addendum · original draw record · support. */
const LandingLinks: FC = () => (
  <div className={classes.verifyLinks}>
    <FinalWindowRulesLink />
    <a className={classes.verifyLink} href={REPRODUCE_URL} target="_blank" rel="noopener noreferrer">
      Original draw and ranking →
    </a>
    <a className={classes.verifyLink} href={`mailto:${CONTACT_EMAIL}`}>
      Giveaway support →
    </a>
  </div>
)

const Contact: FC = () => (
  <p className={classes.contact}>
    Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  </p>
)

const UseDifferentWallet: FC<{ onClick: () => void }> = ({ onClick }) => (
  <p className={classes.connectedRow}>
    <button type="button" className={classes.linkInline} onClick={onClick}>
      Use a different wallet
    </button>
  </p>
)

/** A reserve promoted in the final window (round 3): no further claim step. */
const SelectedNotice: FC<{ rank: number; wallet: string; claimRef?: string; onCheckAnother: () => void }> = ({
  rank,
  wallet,
  claimRef,
  onCheckAnother,
}) => (
  <>
    <div className={classes.wonHead}>
      <div className={classes.wonMark}>★</div>
      <h2 className={classes.screenTitle}>You’ve been selected</h2>
    </div>
    <p className={classes.drawText}>
      We already have your delivery details; no additional claim step is required. We’ll email you
      with the next steps.
    </p>
    <dl className={classes.meta}>
      {claimRef && (
        <div className={classes.metaRow}>
          <dt>Claim reference</dt>
          <dd>{claimRef}</dd>
        </div>
      )}
      <div className={classes.metaRow}>
        <dt>Draw rank</dt>
        <dd>#{rank}</dd>
      </div>
      <div className={classes.metaRow}>
        <dt>Wallet</dt>
        <dd className={classes.address}>{wallet}</dd>
      </div>
    </dl>
    <Contact />
    <UseDifferentWallet onClick={onCheckAnother} />
  </>
)

/** Interactive winners' + final-reserve-window flow. Uses wagmi/AppKit hooks — must be inside providers. */
export const WinnerFlow: FC = () => {
  const { address: rawAddress, isConnected } = useAccount()
  const address = rawAddress ? toChecksum(rawAddress) : undefined
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { open } = useAppKit()

  const [winners, setWinners] = useState<Winner[]>([])
  // undefined = still loading; null = no window row yet (404) → between-rounds hero.
  const [reserveWindow, setReserveWindow] = useState<ReserveWindow | null | undefined>(undefined)
  const [status, setStatus] = useState<WinnerSelected | null>(null)
  const [reserve, setReserve] = useState<ReserveInDraw | null>(null)
  const [notSelected, setNotSelected] = useState(false)
  const [checking, setChecking] = useState(false)
  const [claimToken, setClaimToken] = useState<string | null>(null)
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null)
  const [reserveResult, setReserveResult] = useState<ReserveSubmitResult | null>(null)
  // True while a reserve re-opens the (empty) form to replace an earlier submission.
  const [editing, setEditing] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [closed, setClosed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchWinners().then(setWinners)
    // A failure here must not break the page: treat it like "no window yet".
    void fetchReserveWindow()
      .then(setReserveWindow)
      .catch(() => setReserveWindow(null))
  }, [])

  const resetWallet = useCallback(() => {
    setStatus(null)
    setReserve(null)
    setNotSelected(false)
    setClaimToken(null)
    setClaimResult(null)
    setReserveResult(null)
    setEditing(false)
    setSubmittedEmail(null)
    setError(null)
  }, [])

  const loadStatus = useCallback(
    async (addr: Address) => {
      setChecking(true)
      resetWallet()
      setClosed(false)
      try {
        const s = await fetchWinnerStatus(addr)
        if (s.selected) {
          setStatus(s)
          if (s.claimDeadlineAt && Date.parse(s.claimDeadlineAt) <= Date.parse(s.serverTime)) {
            setClosed(true)
          }
        } else if (s.inDraw) {
          const r = await fetchReserveStatus(addr)
          if (r.inDraw) setReserve(r)
          else setNotSelected(true)
        } else {
          setNotSelected(true)
        }
      } catch (err) {
        setError(err instanceof ClaimError ? err.message : 'Something went wrong. Please try again.')
      } finally {
        setChecking(false)
      }
    },
    [resetWallet],
  )

  useEffect(() => {
    if (!address) {
      resetWallet()
      return
    }
    void loadStatus(address)
  }, [address, loadStatus, resetWallet])

  const handleConnect = () => {
    setError(null)
    void open()
  }

  const checkAnother = async () => {
    resetWallet()
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
      if (reserve) {
        const r = await fetchReserveStatus(address)
        if (r.inDraw) setReserve(r)
      } else {
        const s = await fetchWinnerStatus(address)
        if (s.selected) setStatus(s)
      }
    } catch {
      /* ignore */
    }
  }

  const handleSign = async () => {
    if (!address) return
    const nonce = reserve ? reserve.nonce : status?.nonce
    const statement = reserve ? RESERVE_SIWE_STATEMENT : WINNER_SIWE_STATEMENT
    if (!nonce) {
      await refreshNonce()
      return
    }
    setBusy(true)
    setError(null)
    try {
      const issuedAt = new Date().toISOString()
      const message = buildSiweMessage(address, nonce, issuedAt, statement)
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

  const onReserveSubmitted = (result: ClaimResult, email: string) => {
    // submitReserve always resolves a ReserveSubmitResult; the form is typed on ClaimResult.
    setReserveResult(result as ReserveSubmitResult)
    setSubmittedEmail(email)
    setEditing(false)
  }

  const onSessionExpired = () => {
    setClaimToken(null)
    setError('Your session expired. Please sign again to continue.')
    void refreshNonce()
  }

  const shortWallet = address ? shortAddress(address) : ''

  // Winners grouped for the connect screen. Derived from the API (round + status)
  // so the groups and the progress count stay correct as wallets claim.
  const claimedWinners = winners.filter((w) => w.status === 'claimed')
  const roundTwoWinners = winners.filter((w) => w.round === 2 && w.status !== 'claimed')
  const expiredWinners = winners.filter((w) => w.round === 1 && w.status === 'expired')
  const totalPrizes = winners.filter((w) => w.round === 1).length || 10

  // ---- Screen selection ----
  let body: ReactNode

  if (!isConnected || !address) {
    let head: ReactNode
    if (reserveWindow === undefined) {
      head = (
        <>
          <p className={classes.drawHeadline}>Igra × Tangem Giveaway</p>
          <p className={classes.drawText}>Checking the current claim window…</p>
        </>
      )
    } else if (reserveWindow === null) {
      // resolveLandingHero(null) — between rounds: never the old "closes 14 September" copy.
      head = (
        <>
          <p className={classes.drawHeadline}>Round 2 claims have closed</p>
          <p className={classes.drawText}>
            The final reserve window is being prepared; the dates will appear here as soon as they
            are confirmed.
          </p>
        </>
      )
    } else {
      const w = reserveWindow
      const hero = resolveLandingHero(w)
      head = (
        <>
          <p className={classes.drawHeadline}>Igra × Tangem: final reserve claim window</p>
          <p className={classes.drawText}>
            {prizesLine(w.prizesRemaining)}If your wallet is in the remaining reserve list, submit
            your delivery details before the deadline. After the deadline, prizes not claimed by
            higher-ranked winners go to the highest-ranked eligible submissions in the original draw
            order. This is not first-come-first-served, and submitting does not guarantee a prize.
          </p>
          {hero === 'scheduled' && (
            <p className={classes.drawDeadline}>Submissions open {formatDeadline(w.opensAt)}</p>
          )}
          {hero === 'open' && (
            <p className={classes.drawDeadline}>
              Submissions close {formatDeadline(w.closesAt)} ·{' '}
              <Countdown
                deadlineIso={w.closesAt}
                serverTimeIso={w.serverTime}
                expiredLabel={SUBMISSIONS_CLOSED}
              />
            </p>
          )}
          {(hero === 'closed' || hero === 'finalized') && (
            <p className={classes.drawDeadline}>{SUBMISSIONS_CLOSED}.</p>
          )}
        </>
      )
    }

    body = (
      <>
        {head}
        <Button variant="primary" onClick={handleConnect} className={classes.cta}>
          Connect wallet to check
        </Button>
        <p className={classes.securityLine}>{SAFETY_LINE}</p>
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

          <LandingLinks />
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
        <Contact />
      </>
    )
  } else if (reserveResult && reserve) {
    // §4.5 receipt — submitting is not winning.
    const reserveClosed = reserve.window.state !== 'open' || closed
    body = (
      <>
        <div className={classes.successHead}>
          <div className={classes.successMark}>✓</div>
          <h2 className={classes.screenTitle}>Reserve submission received</h2>
        </div>
        <dl className={classes.meta}>
          <div className={classes.metaRow}>
            <dt>Reference</dt>
            <dd>{reserveResult.claimRef}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Draw rank</dt>
            <dd>#{reserve.rank}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Wallet</dt>
            <dd className={classes.address}>{shortWallet}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Submitted</dt>
            <dd>{formatTimestamp(reserveResult.claimedAt)}</dd>
          </div>
          {reserveResult.updatedAt !== reserveResult.claimedAt && (
            <div className={classes.metaRow}>
              <dt>Updated</dt>
              <dd>{formatTimestamp(reserveResult.updatedAt)}</dd>
            </div>
          )}
          {submittedEmail && (
            <div className={classes.metaRow}>
              <dt>Email</dt>
              <dd>{submittedEmail}</dd>
            </div>
          )}
        </dl>
        <p className={classes.drawText}>
          Selection follows the original draw order after the deadline. We’ll email you either way.
        </p>
        {!reserveClosed && (
          <Button
            variant="primary"
            className={classes.cta}
            onClick={() => {
              setEditing(true)
              setReserveResult(null)
            }}
          >
            Review or edit details
          </Button>
        )}
        <Contact />
        <UseDifferentWallet onClick={() => void checkAnother()} />
      </>
    )
  } else if (claimToken && reserve) {
    // Same form as winners; heading, extra checkbox and endpoint differ (§4.5).
    body = (
      <ShippingForm
        claimToken={claimToken}
        registeredEmail={reserve.registeredEmail}
        deadlineLabel={formatDeadline(reserve.window.closesAt)}
        closed={reserve.window.state !== 'open' || closed}
        onSubmitted={onReserveSubmitted}
        onSessionExpired={onSessionExpired}
        heading="Submit your delivery details"
        extraConfirmation={NO_GUARANTEE}
        submit={submitReserve}
        submitLabel="Submit reserve claim"
        note={editing || reserve.submission ? RESUBMIT_NOTE : undefined}
      />
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
            The claim period closed on {formatDeadline(status.claimDeadlineAt)}.
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
        <UseDifferentWallet onClick={() => void checkAnother()} />
        {error && <p className={classes.error}>{error}</p>}
      </>
    )
  } else if (status && (status.claimStatus === 'expired' || status.claimStatus === 'invalidated')) {
    // §4.2 fix — previously fell through to "Claim received" and showed a false success.
    body = (
      <>
        <h2 className={classes.screenTitle}>Your previous claim window has closed</h2>
        <p className={classes.drawText}>This final window is for unused reserves.</p>
        <dl className={classes.meta}>
          <div className={classes.metaRow}>
            <dt>Draw rank</dt>
            <dd>#{status.rank}</dd>
          </div>
          <div className={classes.metaRow}>
            <dt>Wallet</dt>
            <dd className={classes.address}>{shortWallet}</dd>
          </div>
          {status.claimDeadlineAt && (
            <div className={classes.metaRow}>
              <dt>Claim deadline was</dt>
              <dd>{formatDeadline(status.claimDeadlineAt)}</dd>
            </div>
          )}
        </dl>
        <Contact />
        <UseDifferentWallet onClick={() => void checkAnother()} />
      </>
    )
  } else if (status && status.round === 3) {
    // A reserve selected in the final window: delivery details are already on file (§4.5).
    body = (
      <SelectedNotice
        rank={status.rank}
        wallet={shortWallet}
        claimRef={status.claimRef}
        onCheckAnother={() => void checkAnother()}
      />
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
        <Contact />
        <UseDifferentWallet onClick={() => void checkAnother()} />
      </>
    )
  } else if (reserve) {
    // §4.3 — reserve states, driven by the window state + this wallet's submission.
    const screen = resolveReserveScreen(reserve)
    const { window: w, rank, submission } = reserve
    const reserveClosed = closed || screen === 'closed'
    const rankRows = (
      <>
        <div className={classes.metaRow}>
          <dt>Original draw rank</dt>
          <dd>#{rank}</dd>
        </div>
        <div className={classes.metaRow}>
          <dt>Wallet</dt>
          <dd className={classes.address}>{shortWallet}</dd>
        </div>
      </>
    )

    if (screen === 'scheduled') {
      body = (
        <>
          <h2 className={classes.screenTitle}>You’re on the reserve list</h2>
          <p className={classes.drawText}>
            Your original draw rank is #{rank}. The final window opens on {formatDeadline(w.opensAt)}.
          </p>
          <dl className={classes.meta}>{rankRows}</dl>
          <UseDifferentWallet onClick={() => void checkAnother()} />
        </>
      )
    } else if (screen === 'open-new' || screen === 'open-submitted') {
      const submitted = screen === 'open-submitted' && submission
      body = (
        <>
          {submitted ? (
            <>
              <div className={classes.successHead}>
                <div className={classes.successMark}>✓</div>
                <h2 className={classes.screenTitle}>Reserve submission received</h2>
              </div>
              <p className={classes.drawText}>
                Selection follows the original draw order after the deadline.
              </p>
            </>
          ) : (
            <>
              <h2 className={classes.screenTitle}>You’re on the reserve list</h2>
              <p className={classes.drawText}>
                Your original draw rank is #{rank}. You can submit for a prize not claimed by
                higher-ranked winners; after the deadline they go to the highest-ranked submissions.
              </p>
            </>
          )}
          <dl className={classes.meta}>
            {submitted && (
              <div className={classes.metaRow}>
                <dt>Reference</dt>
                <dd>{submitted.reference}</dd>
              </div>
            )}
            {rankRows}
            {submitted && submitted.submittedAt && (
              <div className={classes.metaRow}>
                <dt>Submitted</dt>
                <dd>{formatTimestamp(submitted.submittedAt)}</dd>
              </div>
            )}
            <div className={classes.metaRow}>
              <dt>Submissions close</dt>
              <dd>{formatDeadline(w.closesAt)}</dd>
            </div>
            <div className={classes.metaRow}>
              <dt>Time left</dt>
              <dd>
                <Countdown
                  deadlineIso={w.closesAt}
                  serverTimeIso={w.serverTime}
                  onExpire={() => setClosed(true)}
                  expiredLabel={SUBMISSIONS_CLOSED}
                />
              </dd>
            </div>
          </dl>

          {reserveClosed ? (
            <p className={classes.closedNotice}>{SUBMISSIONS_CLOSED}.</p>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  if (submitted) setEditing(true)
                  void handleSign()
                }}
                disabled={busy}
                className={classes.cta}
              >
                {busy ? 'Check your wallet…' : submitted ? 'Review or edit details' : 'Verify wallet and continue'}
              </Button>
              <p className={classes.securityLine}>{SAFETY_LINE}</p>
            </>
          )}
          <UseDifferentWallet onClick={() => void checkAnother()} />
          {error && <p className={classes.error}>{error}</p>}
        </>
      )
    } else if (screen === 'closed') {
      body = (
        <>
          <h2 className={classes.screenTitle}>{SUBMISSIONS_CLOSED}</h2>
          <p className={classes.drawText}>
            We’re checking eligible submissions in the original draw order.
          </p>
          <dl className={classes.meta}>{rankRows}</dl>
          <Contact />
          <UseDifferentWallet onClick={() => void checkAnother()} />
        </>
      )
    } else if (screen === 'not-selected') {
      body = (
        <>
          <h2 className={classes.screenTitle}>Not selected for a remaining prize</h2>
          <p className={classes.drawText}>
            Your submission was not selected for a remaining prize. Prizes went to higher-ranked
            eligible submissions in the original draw order.
          </p>
          <dl className={classes.meta}>{rankRows}</dl>
          <p>
            <a className={classes.verifyLink} href={REPRODUCE_URL} target="_blank" rel="noopener noreferrer">
              Original draw and ranking →
            </a>
          </p>
          <Contact />
          <UseDifferentWallet onClick={() => void checkAnother()} />
        </>
      )
    } else {
      // 'selected' — normally the wallet is already selected:true in winner-status.
      body = <SelectedNotice rank={rank} wallet={shortWallet} onCheckAnother={() => void checkAnother()} />
    }
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
