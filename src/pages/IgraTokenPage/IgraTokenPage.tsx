import { FC, useEffect, useState } from "react"

import { AboutBenefits, PageLayout } from "~/Components"
import { Flex, Icon } from "~/shared/ui"

import unlockScheduleChart from './assets/unlock-schedule.png'
import { CirculatingSupply } from './CirculatingSupply'
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

// Unlock Schedule legend — colors sampled directly from the chart image so the
// swatches match each band exactly (Team/Investors/Association/DAO-controlled).
const unlockLegend = [
  { color: '#F17100', label: 'Team' },
  { color: '#DA32CF', label: 'Investors' },
  { color: '#008CF1', label: 'Association' },
  { color: '#00CC9B', label: 'DAO-controlled', note: '(Ecosystem, Grants, Staking rewards)' },
  { color: '#A8A8A8', label: 'Unallocated' },
]

// Right-edge value labels overlaid on the unlock chart as HTML (kept out of the
// image so they stay crisp). `top` is the % height of each band's centre, measured
// from the chart's plot area; colours match the legend.
const unlockValueLabels = [
  { name: 'Unallocated', value: '1.07B', pct: '10.7%', color: '#A8A8A8', top: 17.8 },
  { name: 'Team', value: '1.80B', pct: '18%', color: '#F17100', top: 24 },
  { name: 'Investors', value: '0.43B', pct: '4.3%', color: '#DA32CF', top: 33 },
  { name: 'Association', value: '2B', pct: '20%', color: '#008CF1', top: 45.5 },
  { name: 'DAO', value: '4.70B', pct: '47%', color: '#00CC9B', top: 71 },
]

const SHORT_NAMES: Record<string, string> = {
  'Team & Advisors': 'Team',
  'Ecosystem Development & Grants': 'Ecosystem',
  'Early Token Sale': 'Early sale',
  Community: 'Community',
  'Public Token Sale': 'Public',
  Association: 'Association',
}

// Horizontal allocation bar, derived from distributionItems (same pools + colors);
// "phased DAO control" is stripped from each note per request.
// Bar colors: the four Unlock-schedule legend colors + two extra (violet, gold).
const ALLOC_COLORS: Record<string, string> = {
  'Team & Advisors': '#F17100',
  'Ecosystem Development & Grants': '#7C6CF0',
  'Early Token Sale': '#DA32CF',
  Community: '#00CC9B',
  'Public Token Sale': '#EAB308',
  Association: '#008CF1',
}

// Display widths are intentionally skewed from the real percentages so labels
// fit (Public gets room; Community/Ecosystem trimmed a touch). Labels still show
// the true %. Widths sum to 100.
const ALLOC_WIDTHS: Record<string, number> = {
  Community: 22,
  'Ecosystem Development & Grants': 20,
  Association: 20,
  'Team & Advisors': 18,
  'Early Token Sale': 10,
  'Public Token Sale': 10,
}

const allocationSegments = distributionItems
  .map((it) => {
    const m = it.title.match(/^(.*?)\s*\((\d+)%\)\s*$/)
    const name = m ? m[1] : it.title
    const percent = m ? Number(m[2]) : 0
    return {
      name,
      short: SHORT_NAMES[name] ?? name,
      percent,
      width: ALLOC_WIDTHS[name] ?? percent,
      color: ALLOC_COLORS[name] ?? it.color,
      note: it.description.replace(/,?\s*phased DAO control/i, ''),
    }
  })
  .sort((a, b) => b.percent - a.percent)

const textOn = (hex: string) => {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.5 ? 'rgba(0, 0, 0, 0.85)' : '#FFFFFF'
}

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
              {'Igra Mainnet is a live EVM network built on Kaspa\'s proof-of-work BlockDAG. Public mainnet was launched in February \'26.'}
              <br /><br />
              <span className={classes.boldText}>$IGRA</span>
              {' secures the Igra Network and governs the protocol. Fixed supply, demand grows with network usage. It was launched via '}
              <a
                href="https://www.zealousswap.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.inlineLink}
              >
                Zealous Swap ZAP
              </a>
              {', a fair onchain auction mechanism.'}
              <br /><br />
              {'On this page you can see the token unlock schedule, allocation at genesis, and circulating supply breakdown.'}
              <br /><br />
              {'Token and all network core contracts were audited by '}
              <a
                href="https://github.com/sigp/public-audits/blob/master/reports/igra/Sigma_Prime_Igra_Core_Smart_Contracts_Security_Assessment_Report_v2_1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.inlineLink}
              >
                Sigma Prime
              </a>
              {'.'}
              <br /><br />
              <a
                href="https://igra-labs.gitbook.io/igralabs-docs/igra-token"
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
            <div className={classes.statItem}>
              <span className={classes.statLabel}>Markets</span>
              <span className={classes.statValue}>
                <a
                  href="https://app.zealousswap.com/swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.statsPanelTitleLink}
                >
                  Zealous Swap
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className={classes.unlockSchedule}>
          <h2 className={classes.unlockTitle}>Unlock schedule</h2>
          <div className={classes.chartWrap}>
            <img
              src={unlockScheduleChart}
              alt="IGRA unlock schedule: cumulative circulating supply by allocation category from 2026 to 2031, approaching the 10B cap"
              className={classes.unlockChart}
            />
            {unlockValueLabels.map((l) => (
              <span
                key={l.name}
                className={classes.unlockValueLabel}
                style={{ top: `${l.top}%`, color: l.color }}
              >
                <span className={classes.labelName}>{l.name}</span>
                <span className={classes.labelVal}>
                  {l.value} {l.pct}
                </span>
              </span>
            ))}
          </div>
          <ul className={classes.unlockLegend}>
            {unlockLegend.map((item) => (
              <li key={item.label} className={classes.legendItem}>
                <span className={classes.legendSwatch} style={{ backgroundColor: item.color }} />
                {item.label}
                {item.note && <span className={classes.legendMuted}> {item.note}</span>}
              </li>
            ))}
          </ul>
          <p className={classes.unlockNote}>
            Community and Ecosystem form the DAO-controlled 47% balance. From 10% of early token sale 4.3% actually
            sold, the unsold remainder (5.7%) plus Public/Reserve allocation (5%) form the 10.7% unallocated balance.
          </p>
        </div>

        <CirculatingSupply priceUsd={stats.priceUsd} />

        <div className={classes.allocation}>
          <h2 className={classes.allocTitle}>IGRA allocation at genesis</h2>
          <div className={classes.allocBar}>
            {allocationSegments.map((s) => (
              <div
                key={s.name}
                className={classes.allocSeg}
                style={{ width: `${s.width}%`, backgroundColor: s.color }}
                title={`${s.name} — ${s.percent}%`}
              >
                {s.width >= 8 ? (
                  <span className={classes.allocSegLabel} style={{ color: textOn(s.color) }}>
                    {s.short} {s.percent}%
                  </span>
                ) : s.width >= 3 ? (
                  <span className={classes.allocSegLabel} style={{ color: textOn(s.color) }}>
                    {s.percent}%
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <div className={classes.allocLegend}>
            {allocationSegments.map((s) => (
              <div key={s.name} className={classes.allocLegendItem}>
                <span className={classes.allocSwatch} style={{ backgroundColor: s.color }} />
                <div>
                  <div className={classes.allocLegendName}>
                    {s.name} ({s.percent}%)
                  </div>
                  <div className={classes.allocLegendDesc}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.benefitsTop}>
          <AboutBenefits />
        </div>
      </Flex>
    </PageLayout>
  )
}
