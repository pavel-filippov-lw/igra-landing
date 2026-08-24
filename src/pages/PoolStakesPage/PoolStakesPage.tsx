import { useAppKit } from '@reown/appkit/react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useAccount, useDisconnect, useSwitchChain, useWalletClient } from 'wagmi'

import { PageLayout } from '~/Components'

import { isAppKitConfigured } from './appkit'
import {
  claimAndWithdraw,
  describeError,
  explorerAddress,
  explorerTx,
  formatToken,
  resolveMemberships,
  waitForClaim,
  type Position,
} from './client'
import { errorReason, track, VestingEvent } from './analytics'
import { CHAIN, TOKEN_SYMBOL } from './constants'
import classes from './PoolStakesPage.module.scss'
import { PoolStakesProviders } from './PoolStakesProviders'

const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`

const fmtDate = (unix: number) =>
  `${new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(new Date(unix * 1000))} UTC`

/** Live countdown to a unix timestamp, ticking each second. */
const Countdown: FC<{ to: number }> = ({ to }) => {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000))
  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000)
    return () => clearInterval(id)
  }, [])
  const left = Math.max(0, to - now)
  const d = Math.floor(left / 86_400)
  const h = Math.floor((left % 86_400) / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return (
    <span className={classes.countdown}>
      {d}d {h}h {m}m {s}s
    </span>
  )
}

interface ClaimState {
  status: 'idle' | 'submitting' | 'pending' | 'confirmed' | 'error'
  hash?: string
  message?: string
}

const PositionCard: FC<{
  position: Position
  claim: ClaimState
  onClaim: (position: Position) => void
}> = ({ position, claim, onClaim }) => {
  const { clone, allocated, released, claimable, notStarted, vestedFraction } = position
  const withdrawnPct = allocated === 0n ? 0 : Number((released * 10_000n) / allocated) / 100
  const busy = claim.status === 'submitting' || claim.status === 'pending'
  const canClaim = !notStarted && claimable > 0n && !busy

  return (
    <div className={classes.card}>
      <div className={classes.cardHead}>
        <h2 className={classes.cardTitle}>{clone.name}</h2>
        <span className={`${classes.badge} ${clone.dynamic ? classes.badgeDynamic : classes.badgeStatic}`}>
          {clone.dynamic ? 'Adjustable' : 'Fixed terms'}
        </span>
      </div>
      <p className={classes.cardBlurb}>{clone.blurb}</p>

      <div className={classes.claimable}>
        <span className={classes.claimableLabel}>Claimable now</span>
        <span className={classes.claimableValue}>{formatToken(claimable)} {TOKEN_SYMBOL}</span>
      </div>

      <dl className={classes.stats}>
        <div>
          <dt>Total allocation</dt>
          <dd>{formatToken(allocated)} {TOKEN_SYMBOL}</dd>
        </div>
        <div>
          <dt>Withdrawn so far</dt>
          <dd>{formatToken(released)} {TOKEN_SYMBOL}</dd>
        </div>
        <div>
          <dt>Remaining locked</dt>
          <dd>{formatToken(allocated - released)} {TOKEN_SYMBOL}</dd>
        </div>
        <div>
          <dt>Vested</dt>
          <dd>{(vestedFraction * 100).toFixed(1)}%</dd>
        </div>
      </dl>

      <div className={classes.progressRow}>
        <div className={classes.progressTrack} aria-hidden="true">
          <div className={classes.progressVested} style={{ width: `${vestedFraction * 100}%` }} />
          <div className={classes.progressWithdrawn} style={{ width: `${withdrawnPct}%` }} />
        </div>
        <div className={classes.progressLegend}>
          <span>
            <i className={classes.dotWithdrawn} /> {withdrawnPct.toFixed(1)}% withdrawn
          </span>
          <span>
            <i className={classes.dotVested} /> {(vestedFraction * 100).toFixed(1)}% vested
          </span>
        </div>
      </div>

      <p className={classes.timeline}>
        {fmtDate(position.start)} → {fmtDate(position.end)}
      </p>

      {notStarted ? (
        <div className={classes.prestart}>
          <span className={classes.prestartLabel}>Vesting starts in</span>
          <Countdown to={position.start} />
          <button className={classes.cta} type="button" disabled>
            Claim
          </button>
        </div>
      ) : (
        <button className={classes.cta} type="button" disabled={!canClaim} onClick={() => onClaim(position)}>
          {busy ? 'Claiming…' : claimable > 0n ? 'Claim & withdraw' : 'Nothing to claim yet'}
        </button>
      )}

      {claim.status === 'pending' && claim.hash && (
        <p className={classes.txNote}>
          Waiting for confirmation —{' '}
          <a href={explorerTx(claim.hash)} target="_blank" rel="noopener noreferrer">
            view transaction
          </a>
        </p>
      )}
      {claim.status === 'confirmed' && claim.hash && (
        <p className={`${classes.txNote} ${classes.txOk}`}>
          Claimed —{' '}
          <a href={explorerTx(claim.hash)} target="_blank" rel="noopener noreferrer">
            view transaction
          </a>
        </p>
      )}
      {claim.status === 'error' && claim.message && (
        <p className={`${classes.txNote} ${classes.txErr}`}>{claim.message}</p>
      )}
    </div>
  )
}

/** The interactive app — only mounted when WalletConnect is configured (hooks need WagmiProvider). */
const ConnectedApp: FC = () => {
  const { address, isConnected, chainId } = useAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { data: walletClient } = useWalletClient()

  const activeHolder = isConnected ? (address as `0x${string}` | undefined) : undefined

  const [positions, setPositions] = useState<Position[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [claims, setClaims] = useState<Record<string, ClaimState>>({})

  // Latest holder for the polling loop, without re-subscribing each render.
  const holderRef = useRef<`0x${string}` | undefined>(undefined)
  holderRef.current = activeHolder

  const refresh = useCallback(async (silent = false) => {
    const holder = holderRef.current
    if (!holder) return
    if (!silent) setLoading(true)
    try {
      const next = await resolveMemberships(holder)
      // Drop a stale result: if the connected wallet changed while this read was
      // in flight, don't paint the previous wallet's allocation over the new one.
      if (holderRef.current !== holder) return
      setPositions(next)
      setLoadError(null)
      // Only on a foreground load (not the 12s poll), so counts aren't inflated.
      if (!silent && next.length === 0) track(VestingEvent.NoAllocation)
    } catch (err) {
      if (holderRef.current !== holder) return
      setLoadError(describeError(err))
      if (!silent) track(VestingEvent.LoadError, { reason: errorReason(err) })
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  // Load whenever the active holder changes (connect / disconnect).
  useEffect(() => {
    if (!activeHolder) {
      setPositions(null)
      return
    }
    void refresh()
  }, [activeHolder, refresh])

  // Poll every 12s so raises, new members and VestingClaimed (factor moves) show
  // up without a reload. Silent refresh — no spinner flicker.
  useEffect(() => {
    if (!activeHolder) return
    const id = setInterval(() => void refresh(true), 12_000)
    return () => clearInterval(id)
  }, [activeHolder, refresh])

  const setClaim = (key: string, state: ClaimState) =>
    setClaims((prev) => ({ ...prev, [key]: state }))

  const onClaim = useCallback(
    async (position: Position) => {
      const key = position.clone.key
      if (!walletClient) {
        open()
        return
      }
      track(VestingEvent.ClaimStart, { pool: key })
      setClaim(key, { status: 'submitting' })
      try {
        const hash = await claimAndWithdraw(walletClient, position.clone)
        track(VestingEvent.ClaimSubmitted, { pool: key })
        setClaim(key, { status: 'pending', hash })
        await waitForClaim(hash)
        track(VestingEvent.ClaimConfirmed, { pool: key })
        setClaim(key, { status: 'confirmed', hash })
        await refresh(true)
      } catch (err) {
        track(VestingEvent.ClaimError, { pool: key, reason: errorReason(err) })
        setClaim(key, { status: 'error', message: describeError(err) })
      }
    },
    [walletClient, open, refresh],
  )

  const wrongNetwork = isConnected && chainId !== undefined && chainId !== CHAIN.id

  // Funnel events: a wallet connected (once per connection), and connecting on the
  // wrong chain — the two most common "can't claim" causes, visible in Plausible.
  useEffect(() => {
    if (isConnected && address) track(VestingEvent.Connected)
  }, [isConnected, address])
  useEffect(() => {
    if (wrongNetwork) track(VestingEvent.WrongNetwork, { chainId: chainId ?? 0 })
  }, [wrongNetwork, chainId])

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div>
          <p className={classes.eyebrow}>Igra vesting</p>
          <h1 className={classes.title}>Claim your allocation</h1>
        </div>
        {isConnected && address && (
          <div className={classes.account}>
            <a href={explorerAddress(address)} target="_blank" rel="noopener noreferrer">
              {short(address)}
            </a>
            <button type="button" className={classes.linkBtn} onClick={() => disconnect()}>
              Disconnect
            </button>
          </div>
        )}
      </header>

      {!isConnected && !activeHolder && (
        <div className={classes.intro}>
          <p>
            Connect the wallet that holds your vesting allocation to see what has vested and claim
            it. Claiming is a single transaction; there is nothing to sign otherwise.
          </p>
          <button className={classes.cta} type="button" onClick={() => open()}>
            Connect wallet
          </button>
        </div>
      )}

      {wrongNetwork && (
        <div className={classes.warn}>
          <span>Wrong network. Switch to {CHAIN.name} to continue.</span>
          <button
            className={classes.linkBtn}
            type="button"
            onClick={() => switchChain({ chainId: CHAIN.id })}
          >
            Switch network
          </button>
        </div>
      )}

      {activeHolder && !wrongNetwork && (
        <>
          {loading && positions === null && <p className={classes.muted}>Loading allocation…</p>}

          {loadError && (
            <div className={classes.warn}>
              <span>{loadError}</span>
              <button className={classes.linkBtn} type="button" onClick={() => void refresh()}>
                Retry
              </button>
            </div>
          )}

          {positions !== null && positions.length === 0 && (
            <div className={classes.empty}>
              <p>No allocation found for this wallet.</p>
              <p className={classes.muted}>
                If you expected one, double-check you connected the right address.
              </p>
            </div>
          )}

          {positions !== null && positions.length > 0 && (
            <div className={classes.cards}>
              {positions.map((p) => (
                <PositionCard
                  key={p.clone.key}
                  position={p}
                  claim={claims[p.clone.key] ?? { status: 'idle' }}
                  onClaim={onClaim}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** Static fallback when WalletConnect is not configured on this deployment. */
const NotConfigured: FC = () => (
  <div className={classes.root}>
    <header className={classes.header}>
      <div>
        <p className={classes.eyebrow}>Igra vesting</p>
        <h1 className={classes.title}>Claim your allocation</h1>
      </div>
    </header>
    <div className={classes.warn}>
      Wallet connection isn’t configured on this deployment. Set{' '}
      <code>VITE_WALLETCONNECT_PROJECT_ID</code> to enable connecting.
    </div>
  </div>
)

export const PoolStakesPage: FC = () => (
  <PoolStakesProviders>
    <PageLayout hideBg>{isAppKitConfigured ? <ConnectedApp /> : <NotConfigured />}</PageLayout>
  </PoolStakesProviders>
)
