import { FC, useEffect, useState } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex, Icon } from "~/shared/ui"

import tokenDistributionChart from './assets/token-distribution-chart.png'
import classes from './IgraTokenPage.module.scss'

const distributionItems = [
  {
    color: '#F5A623',
    title: 'Team & Advisors (18%)',
    description: '1.8% minted on TGE, 6 months lockup, 36 months vesting',
  },
  {
    color: '#6B2FE0',
    title: 'Ecosystem Development & Grants (22%)',
    description: '2.2% minted on TGE, no lockup, 60 months vesting, phased DAO control',
  },
  {
    color: '#E91E8C',
    title: 'Early Token Sale (10%)',
    description: '1% minted on TGE, 6 months lockup, 18 months vesting',
  },
  {
    color: '#6B2FE0',
    title: 'Community (25%)',
    description: '2.5% minted on TGE, no lockup, 60 months vesting, phased DAO control',
  },
  {
    color: '#E91E8C',
    title: 'Public Token Sale (5%)',
    description: '0.5% minted on TGE, no lockup, 12 months vesting',
  },
  {
    color: '#0D6B5E',
    title: 'Association (20%)',
    description: '2% minted on TGE, no lockup, 24 months vesting, phased DAO control',
  },
]

const TOKEN_API = 'https://apis.igralabs.com/igra-token'
const PRICE_API = 'https://apis.igralabs.com/twap/price/0x093d77d397F8acCbaee0820345E9E700B1233cD1'
const RPC_URL = 'https://rpc.igralabs.com:8545'
const ATTESTATION_DIAMOND = '0xc24Df70E408739aeF6bF594fd41db4632dF49188'
// Function selector for getTotalStats()
const GET_TOTAL_STATS_SELECTOR = '0xfc5cbf1d'

interface TokenStats {
  maxSupply?: number
  totalSupply?: number
  totalStaked?: number
  priceUsd?: number
  priceIkas?: number
}

function formatNumber(n: number | undefined): string {
  if (n === undefined) return '—'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(0)
}

function formatPrice(n: number | undefined): string {
  if (n === undefined) return '—'
  return `$${n.toFixed(6)}`
}

async function fetchTokenStats(): Promise<TokenStats> {
  const result: TokenStats = {}

  // Fetch supply data
  try {
    const res = await fetch(TOKEN_API)
    if (res.ok) {
      const data = await res.json()
      result.maxSupply = parseFloat(data.maxSupply)
      result.totalSupply = parseFloat(data.totalSupply)
    }
  } catch { /* ignore */ }

  // Fetch price
  try {
    const res = await fetch(PRICE_API)
    if (res.ok) {
      const data = await res.json()
      result.priceUsd = data.price_usd
      result.priceIkas = data.price_ikas
    }
  } catch { /* ignore */ }

  // Fetch total staked from Attestation Diamond contract
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: ATTESTATION_DIAMOND, data: GET_TOTAL_STATS_SELECTOR }, 'latest'],
      }),
    })
    if (res.ok) {
      const json = await res.json()
      const hex: string = json.result
      if (hex && hex.length >= 2 + 64 * 3) {
        // Parse tuple: stakedAmount (uint256), penalties (uint256), slashes (uint256), ...
        const staked = BigInt('0x' + hex.slice(2, 66))
        const penalties = BigInt('0x' + hex.slice(66, 130))
        const slashes = BigInt('0x' + hex.slice(130, 194))
        const effective = staked - penalties - slashes
        result.totalStaked = Number(effective) / 1e18
      }
    }
  } catch { /* ignore */ }

  return result
}

export const IgraTokenPage: FC = () => {
  const [stats, setStats] = useState<TokenStats>({})

  useEffect(() => {
    let cancelled = false
    fetchTokenStats().then(s => {
      if (!cancelled) setStats(s)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <PageLayout hideBg>
      <Flex flexDirection='column' gap={40} className={classes.root}>
        <div className={classes.heroRow}>
          <Flex flexDirection='column' gap={30} className={classes.heroContent}>
            <div>
              <h2 className={classes.subtitle}>KAS for inclusion. $IGRA for execution.</h2>
            </div>
            <p className={classes.description}>
              <span className={classes.boldText}>$IGRA</span>
              {' secures the Igra Network and governs the protocol. Fixed supply. Demand grows with network usage.'}
              <br />
              {'Fair launched via '}
              <a
                href="https://www.zealousswap.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.inlineLink}
              >
                Zealous Swap ZAP
              </a>
              {', a fair onchain auction mechanism. No hidden actors, no frontrunning, no undisclosed allocations, no random airdrops.'}
              <br /><br />
              <a
                href="https://igra-labs.gitbook.io/igralabs-docs"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.inlineLink}
              >
                Documentation <Icon name='arrowTopRight' size={10} />
              </a>
              <br />
              <a
                href="https://github.com/IgraLabs/research/blob/main/igra-litepaper-v1.0.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.inlineLink}
              >
                Litepaper <Icon name='arrowTopRight' size={10} />
              </a>
            </p>
            <div className={classes.participateSection}>
              <h3 className={classes.participateTitle}>
                Now trading:{' '}
                <a
                  href="https://app.zealousswap.com/swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.contactLink}
                >
                  Zealous Swap
                </a>
              </h3>
            </div>
          </Flex>

          <div className={classes.statsPanel}>
            <h3 className={classes.statsPanelTitle}>
              <a
                href="https://explorer.igralabs.com/token/0x093d77d397F8acCbaee0820345E9E700B1233cD1"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.statsPanelTitleLink}
              >
                $IGRA
              </a>
              {' Stats'}
            </h3>
            <div className={classes.statItem}>
              <span className={classes.statLabel}>Price</span>
              <span className={classes.statValue}>
                {formatPrice(stats.priceUsd)}
                {stats.priceIkas !== undefined && (
                  <span className={classes.statValueSecondary}> ({stats.priceIkas.toFixed(4)} iKAS)</span>
                )}
              </span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statLabel}>Max Supply</span>
              <span className={classes.statValue}>{formatNumber(stats.maxSupply)}</span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statLabel}>Total Supply</span>
              <span className={classes.statValue}>{formatNumber(stats.totalSupply)}</span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statLabel}>FDV</span>
              <span className={classes.statValue}>
                {stats.priceUsd && stats.maxSupply
                  ? `$${formatNumber(stats.priceUsd * stats.maxSupply)}`
                  : '—'}
              </span>
            </div>
            <div className={classes.statItem}>
              <span className={classes.statLabel}>Total Staked</span>
              <span className={classes.statValue}>
                {formatNumber(stats.totalStaked)}
                {stats.totalStaked !== undefined && (
                  <span className={classes.statValueSecondary}> IGRA</span>
                )}
              </span>
            </div>
          </div>
        </div>

        <AboutBenefits />
        <div className={classes.tokenDistribution}>
          <h2 className={classes.distributionTitle}>Token distribution</h2>
          <div className={classes.distributionGrid}>
            {distributionItems.map((item, index) => (
              <div key={index} className={classes.distributionItem}>
                <div className={classes.distributionBar} style={{ backgroundColor: item.color }} />
                <div className={classes.distributionContent}>
                  <div className={classes.distributionItemTitle}>{item.title}</div>
                  <div className={classes.distributionItemDesc}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <img
            src={tokenDistributionChart}
            alt="Token distribution vesting schedule chart"
            className={classes.distributionChart}
          />
        </div>
      </Flex>
    </PageLayout>
  )
}
