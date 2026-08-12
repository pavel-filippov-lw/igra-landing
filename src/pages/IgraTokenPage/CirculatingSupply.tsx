import { FC, useEffect, useState } from 'react'

import { Icon } from '~/shared/ui'

import classes from './CirculatingSupply.module.scss'

// Igra's own published circulating-supply endpoint — public, no auth, CORS-friendly.
// Every number in this section is fetched here at page load; nothing is hardcoded.
const TOKEN_API = 'https://apis.igralabs.com/igra-token'
const COINGECKO_URL = 'https://www.coingecko.com/en/coins/igra'
// Wallets we count as circulating to line up with CoinGecko's methodology, even
// though the API lists them as non-circulating. CoinGecko treats the team wallet
// as circulating; excluding it here is what made our figure run ~2M below CG's.
const COUNTED_AS_CIRCULATING = new Set<string>(['Igra Team'])
const CAP = 10_000_000_000
const EXPLORER = 'https://explorer.igralabs.com/address'

interface ExcludedWallet {
  address: string
  description: string
  balance: number
}

interface SupplyData {
  totalSupply: number
  circulatingSupply: number
  excluded: ExcludedWallet[]
  totalExcluded: number
  fetchedAt: Date
}

// Why each wallet is excluded from circulating supply. Keyed by the API's own
// `description` so labels stay correct if the list changes; a missing key just
// omits the note rather than showing something wrong.
const EXCLUSION_REASONS: Record<string, string> = {
  VestingPools: 'Unreleased vesting allocations',
  Attesting: 'Staked\nAttesters or voters',
  StakeRewardsController: 'Attester rewards not yet distributed',
  ContinuousClearingAuction: 'Sold at auction, not yet claimed by buyers',
  'Igra Team': 'Team allocation, under a no-transfer commitment',
}

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US')
const fmtUsd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`
const fmtUtc = (d: Date) =>
  `${new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(d)} UTC`

const CopyButton: FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className={classes.copyBtn}
      aria-label={`Copy address ${value}`}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        })
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

/**
 * Circulating supply — dynamic. Renders entirely from the igra-token endpoint,
 * showing the number, who holds the rest, the subtraction that reconciles them,
 * and an honest note that "excluded" is not "locked". `priceUsd` (already fetched
 * by the parent for the stats panel) is reused for market cap; if absent, market
 * cap is hidden rather than shown stale.
 */
export const CirculatingSupply: FC<{ priceUsd?: number }> = ({ priceUsd }) => {
  const [data, setData] = useState<SupplyData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(TOKEN_API)
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`)
        return r.json()
      })
      .then((d) => {
        if (cancelled) return
        const all: ExcludedWallet[] = (d.nonCirculatingAddresses ?? [])
          .map((a: { address: string; description: string; balance: string }) => ({
            address: a.address,
            description: a.description,
            balance: Number(a.balance),
          }))
          .sort((a: ExcludedWallet, b: ExcludedWallet) => b.balance - a.balance)
        // Treat the team wallet as circulating (CoinGecko does), so only the
        // remaining wallets are subtracted and our figure aligns with CG.
        const excluded = all.filter((w) => !COUNTED_AS_CIRCULATING.has(w.description))
        const totalSupply = Number(d.totalSupply)
        const totalExcluded = excluded.reduce((s, a) => s + a.balance, 0)
        setData({
          totalSupply,
          circulatingSupply: totalSupply - totalExcluded,
          excluded,
          totalExcluded,
          fetchedAt: new Date(),
        })
        setError(false)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) {
    return (
      <section className={classes.section}>
        <h2 className={classes.title}>Circulating supply</h2>
        <p className={classes.muted}>
          {error ? 'Couldn’t load live supply data — please refresh.' : 'Loading circulating supply…'}
        </p>
      </section>
    )
  }

  const { totalSupply, circulatingSupply, excluded, totalExcluded, fetchedAt } = data
  const pctMinted = (circulatingSupply / totalSupply) * 100
  const pctCap = (circulatingSupply / CAP) * 100
  const marketCap = priceUsd ? circulatingSupply * priceUsd : undefined

  return (
    <section className={classes.section}>
      <h2 className={classes.title}>Circulating supply</h2>

      <div className={classes.headline}>
        <div className={classes.bigNumber}>
          {fmtInt(circulatingSupply)} <span className={classes.unit}>IGRA circulating</span>
        </div>
        <div className={classes.subline}>
          {pctMinted.toFixed(2)}% of minted supply · {pctCap.toFixed(2)}% of the 10B cap
        </div>
        <div className={classes.marketCap}>
          {marketCap !== undefined && priceUsd !== undefined && (
            <>
              Market cap {fmtUsd(marketCap)}{' '}
              <span className={classes.muted}>· at ${priceUsd.toFixed(6)}/IGRA</span>
              {' · '}
            </>
          )}
          <a href={COINGECKO_URL} target="_blank" rel="noopener noreferrer" className={classes.cgLink}>
            View on CoinGecko <Icon name="arrowTopRight" size={10} />
          </a>
        </div>
      </div>

      <p className={classes.explain}>
        Circulating supply is total minted supply minus tokens held by the protocol and the Association.
      </p>

      <div className={classes.tableWrap}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Address</th>
              <th className={classes.num}>Balance</th>
              <th className={classes.num}>% of minted</th>
            </tr>
          </thead>
          <tbody>
            {excluded.map((w) => (
              <tr key={w.address}>
                <td>
                  <div className={classes.walletName}>{w.description}</div>
                  {EXCLUSION_REASONS[w.description] && (
                    <div className={classes.walletWhy}>{EXCLUSION_REASONS[w.description]}</div>
                  )}
                </td>
                <td className={classes.addrCell}>
                  <a
                    href={`${EXPLORER}/${w.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.addrLink}
                  >
                    {shortAddr(w.address)}
                  </a>
                  <CopyButton value={w.address} />
                </td>
                <td className={classes.num}>{fmtInt(w.balance)}</td>
                <td className={classes.num}>{((w.balance / totalSupply) * 100).toFixed(2)}%</td>
              </tr>
            ))}
            <tr className={classes.totalRow}>
              <td>Total excluded</td>
              <td />
              <td className={classes.num}>{fmtInt(totalExcluded)}</td>
              <td className={classes.num}>{((totalExcluded / totalSupply) * 100).toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={classes.calc}>
        <div className={classes.calcRow}>
          <span className={classes.calcNum}>{fmtInt(totalSupply)}</span>
          <span className={classes.calcLabel}>total minted</span>
        </div>
        <div className={classes.calcRow}>
          <span className={classes.calcNum}>− {fmtInt(totalExcluded)}</span>
          <span className={classes.calcLabel}>held by protocol / Association</span>
        </div>
        <div className={`${classes.calcRow} ${classes.calcTotal}`}>
          <span className={classes.calcNum}>= {fmtInt(circulatingSupply)}</span>
          <span className={classes.calcLabel}>circulating</span>
        </div>
      </div>

      <p className={classes.meta}>
        As of {fmtUtc(fetchedAt)} · source:{' '}
        <a href={TOKEN_API} target="_blank" rel="noopener noreferrer" className={classes.metaLink}>
          apis.igralabs.com/igra-token
        </a>
      </p>
    </section>
  )
}
