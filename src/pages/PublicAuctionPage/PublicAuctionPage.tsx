import clsx from "clsx"
import { FC, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { PageLayout } from "~/Components"
import { to } from "~/shared/lib"
import { Icon } from "~/shared/ui/Icon/Icon"

import { AttesterCalculator } from './AttesterCalculator'
import { RecentBids } from './RecentBids'
import classes from './PublicAuctionPage.module.scss'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'facts', label: 'Facts' },
  { id: 'faq', label: 'FAQ' },
  { id: 'how-to-participate', label: 'How to Participate' },
  { id: 'attester-calculator', label: 'Attester Calculator' },
  { id: 'contracts', label: 'Smart Contracts' },
  { id: 'guides', label: 'Guides & Tutorials' },
  { id: 'support', label: 'Support' },
]

const validSections = new Set(sections.map(s => s.id))

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 8.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1" />
    <path d="M9.5 7.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1" />
  </svg>
)

const AnchorLink: FC<{ id: string }> = ({ id }) => {
  const [copied, setCopied] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url).then(() => {
      window.history.replaceState(null, '', `${window.location.pathname}#${id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <span className={classes.anchorLinkWrap}>
      <button className={classes.anchorLink} onClick={handleClick} aria-label="Copy link">
        <LinkIcon />
      </button>
      {copied && <span className={classes.anchorToast}>Copied!</span>}
    </span>
  )
}

export const PublicAuctionPage: FC = () => {
  const { section } = useParams<{ section?: string }>()
  const activeSection = section && validSections.has(section) ? section : 'overview'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [howOpen, setHowOpen] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const timer = setTimeout(() => {
      const el = document.getElementById(hash)
      if (!el) return
      const details = el.closest('details')
      if (details && !details.open) details.open = true
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(timer)
  }, [activeSection])

  const handleJoinClick = () => {
    window.plausible?.('JoinAuctionClick')
    window.open('https://auctions.zealousswap.com/auctions/igra', '_blank', 'noopener,noreferrer')
  }

  const activeLabel = sections.find(s => s.id === activeSection)?.label ?? 'Overview'

  return (
    <PageLayout hideBg>
      <div className={clsx(classes.root, { [classes.rootWithBg]: activeSection === 'overview' })}>
        {/* Mobile hamburger */}
        <div className={classes.mobileHeader}>
          <div
            className={classes.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={classes.body}>
          {/* Desktop sidebar */}
          <aside className={classes.sidebar}>
            <nav>
              {sections.map((s) => (
                <Link
                  key={s.id}
                  to={to.publicAuction(s.id)}
                  className={clsx(classes.navItem, { [classes.active]: activeSection === s.id })}
                  onClick={() => document.getElementById('root')?.scrollTo({ top: 0 })}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content area */}
          <main className={clsx(classes.content, { [classes.contentWide]: activeSection === 'attester-calculator' || activeSection === 'contracts' || activeSection === 'how-to-participate' })}>
            {activeSection === 'overview' ? (
              <div className={classes.titleRowOverview}>
                <button className={classes.joinButton} onClick={handleJoinClick}>
                  IGRA Public Auction <span className={classes.chevron}>›</span>
                </button>
                <h1 className={classes.pageTitle}>{activeLabel}</h1>
              </div>
            ) : (
              <div className={clsx(classes.titleRow, { [classes.titleRowWide]: activeSection === 'attester-calculator' || activeSection === 'contracts' || activeSection === 'how-to-participate' })}>
                <div>
                  {activeSection !== 'attester-calculator' && <span className={classes.pageSuperTitle}>Public Auction:</span>}
                  <h1 className={classes.pageTitle}>{activeLabel}</h1>
                </div>
                <button className={classes.joinButton} onClick={handleJoinClick}>
                  IGRA Public Auction <span className={classes.chevron}>›</span>
                </button>
              </div>
            )}
            {activeSection === 'overview' ? (
              <div className={classes.disclaimerContent}>
                <p>The IGRA Public Auction was an onchain, permissionless token distribution which ran March 28&nbsp;— April 3, 2026, where the market set the price. Operated by ZealousSwap on Igra Mainnet, built on Uniswap's battle-tested and audited <a href="https://docs.uniswap.org/contracts/liquidity-launchpad/CCA" target="_blank" rel="noopener noreferrer" className={classes.factLink}>CCA contracts</a>.</p>

                <div className={classes.auctionResults}>
                  <h2 className={classes.auctionResultsTitle}>Auction Results</h2>
                  <div className={classes.auctionResultsRow}>
                    <div className={classes.auctionResultItem}>
                      <span className={classes.auctionResultLabel}>Concluded Price</span>
                      <span className={classes.auctionResultValue}>0.1652 iKAS</span>
                    </div>
                  </div>
                  <div className={classes.auctionResultsRow}>
                    <div className={classes.auctionResultItem}>
                      <span className={classes.auctionResultLabel}>Total Bids</span>
                      <span className={classes.auctionResultValue}>1,915</span>
                    </div>
                    <div className={classes.auctionResultItem}>
                      <span className={classes.auctionResultLabel}>Unique Bidders</span>
                      <span className={classes.auctionResultValue}>528</span>
                    </div>
                    <div className={classes.auctionResultItem}>
                      <span className={classes.auctionResultLabel}>Total Sold</span>
                      <span className={classes.auctionResultValue}>49.36M IGRA</span>
                    </div>
                  </div>
                </div>

                <RecentBids />
                <p>Igra Association supplied the tokens&nbsp;— the auction contract was controlled by ZealousSwap, with no ability for either party to intervene once deployed.</p>
                <p>Floor price was set at $0.006 per IGRA equivalent in iKAS at contract deployment&nbsp;— the auction could not clear below this. Price moved up only when real demand required it.</p>
                <p>Docs: <a href="https://zealous-auctions.gitbook.io/zealous-auctions-docs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>zealous-auctions.gitbook.io</a></p>

                <h2 className={classes.disclaimerHeading}>Important dates</h2>
                <div className={classes.datesTable}>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>Genesis block minted, TGE</span><span className={classes.dateValue}>February 25, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP core contract deployment</span><span className={classes.dateValue}>March 25, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP auction start</span><span className={classes.dateValue}>March 26, 2026, 4PM UTC</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP auction finalized</span><span className={classes.dateValue}>April 2, 2026, 4PM UTC</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>IGRA tokens available for claiming</span><span className={classes.dateValue}>April 9, 2026</span></div>
                </div>

                <h2 className={classes.disclaimerHeading}>Useful links</h2>
                <ul className={classes.guideList}>
                  <li><a href="https://igralabs.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>igralabs.com</a></li>
                  <li><a href="https://x.com/Igra_Labs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra on X</a></li>
                  <li><a href="https://t.me/IgraCommunity" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra on Telegram</a></li>
                  <li><a href="https://discord.gg/igralabs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra on Discord</a></li>
                </ul>
              </div>
            ) : activeSection === 'how-to-participate' ? (
              <div className={classes.disclaimerContent}>
                <h3 className={classes.guidePhaseHeading} id="before-march-26">1. Before March 26 <AnchorLink id="before-march-26" /></h3>

                <div className={clsx(classes.faqList, classes.guideSteps)}>
                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="understand-zap"><span>a. Understand how ZAP works <AnchorLink id="understand-zap" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>Read the full auction mechanics before placing any bids.</p>
                      <Link to={to.publicAuction('overview')} className={classes.guideArrowLink}>→ Auction Overview</Link>
                      <a href="https://www.youtube.com/watch?v=0J-tbrpTlXo" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Uniswap's Continuous Clearing Auction (CCA) Explained</a>
                      <a href="https://blog.uniswap.org/continuous-clearing-auctions" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Continuous Clearing Auctions: Bootstrapping Liquidity on Uniswap v4</a>
                    </div>
                  </details>

                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="set-up-wallet"><span>b. Set up your wallet <AnchorLink id="set-up-wallet" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>You need two things: a <strong>Kaspa L1 wallet</strong> (to hold KAS before bridging) and an <strong>Igra EVM wallet</strong> (to bid and receive IGRA).</p>
                      <p><strong>Option A&nbsp;— EVM-only wallet</strong></p>
                      <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ MetaMask</a>
                      <a href="https://rabby.io" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Rabby</a>
                      <p style={{ marginTop: 24 }}><strong>Option B&nbsp;— L1+L2 wallet (Kaspa + Igra in one app)</strong></p>
                      <ul className={classes.guideList}>
                        <li><a href="https://kasperia-doc.github.io/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasperia</a></li>
                        <li><a href="https://www.kasware.xyz/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasware</a></li>
                        <li><a href="https://kastle.cc/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kastle</a></li>
                      </ul>
                    </div>
                  </details>

                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="add-igra-network"><span>c. Add Igra Network to your EVM wallet <AnchorLink id="add-igra-network" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>Add Igra Mainnet using the official network details:</p>
                      <a href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/network-info#igra-mainnet" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Igra Network Info</a>
                      <a href="https://chainlist.org/chain/38833" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Chainlist</a>
                      <p>Once added, make sure your wallet is set to Igra Network before interacting with the auction.</p>
                    </div>
                  </details>

                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="buy-kas"><span>d. Buy KAS <AnchorLink id="buy-kas" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>Purchase KAS from any of the following:</p>
                      <p style={{ marginBottom: 4 }}><strong>Exchanges</strong>&nbsp;— full list with live volume:</p>
                      <a href="https://www.coingecko.com/en/coins/kaspa#markets" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ CoinGecko KAS Markets</a>
                      <p style={{ marginBottom: 4 }}><strong>Recommended:</strong></p>
                      <a href="https://www.kraken.com" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Kraken</a>
                      <p style={{ marginBottom: 4 }}><strong>Fiat on-ramp services:</strong></p>
                      <ul className={classes.guideList} style={{ marginTop: 0 }}>
                        <li><a href="https://guardarian.com/buy-kas" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Guardarian</a></li>
                        <li><a href="https://topper.money" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Topper</a></li>
                      </ul>
                      <p style={{ marginBottom: 4 }}><strong>Wallet with built-in KAS purchase:</strong></p>
                      <ul className={classes.guideList} style={{ marginTop: 0 }}>
                        <li><a href="https://zelcore.io" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Zelcore</a>&nbsp;— buy KAS directly in the wallet</li>
                      </ul>
                    </div>
                  </details>

                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="bridge-kas"><span>e. Bridge KAS → iKAS <AnchorLink id="bridge-kas" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>iKAS is the bridged representation of KAS on Igra Network. You bid using iKAS.</p>
                      <p><strong>Available bridges:</strong></p>
                      <ul className={classes.guideList}>
                        <li><a href="https://ikas.katbridge.com/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>KAT Bridge</a>&nbsp;— recommended</li>
                        <li><a href="https://kasperia-doc.github.io/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasperia</a></li>
                        <li><a href="https://www.kasware.xyz/" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasware</a></li>
                        <li><a href="https://kurncy.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kurncy Wallet</a></li>
                        <li>CLI tool (advanced users)&nbsp;— <a href="https://igra-labs.gitbook.io/igralabs-docs/for-developers/architecture/specifications/igra-transaction-protocol#id-4.3-entry" target="_blank" rel="noopener noreferrer" className={classes.factLink}>ITP Entry documentation</a></li>
                      </ul>
                      <div className={classes.guideNote}>
                        <strong>Note:</strong> Bridging on Igra is permissionless and instant (1–2 seconds). If a transaction fails, it reverts immediately&nbsp;— no funds are lost. No custodian and no fees.
                      </div>
                    </div>
                  </details>

                  <details className={classes.faqItem}>
                    <summary className={classes.faqQuestion} id="verify-balance"><span>f. Verify your iKAS balance <AnchorLink id="verify-balance" /></span></summary>
                    <div className={classes.faqAnswer}>
                      <p>Before March 26, confirm that iKAS is visible in your EVM wallet on <a href="https://explorer.igralabs.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra Network</a>. Do not proceed to the auction without completing this step.</p>
                    </div>
                  </details>
                </div>

                <h3 className={classes.guidePhaseHeading} id="auction-opens">2. March 26&nbsp;— Auction Opened <AnchorLink id="auction-opens" /></h3>
                <div className={classes.guidePhaseContent}>
                  <ol className={classes.guideList}>
                    <li>Go to the auction page: <a href="https://auctions.zealousswap.com/auctions/igra" target="_blank" rel="noopener noreferrer" className={classes.factLink}>auctions.zealousswap.com/auctions/igra</a></li>
                    <li>Connect your EVM wallet (set to Igra Network)</li>
                    <li>Place your bid using iKAS</li>
                    <li>You could monitor active bids and place additional bids at any time until April 2</li>
                  </ol>
                  <a href="https://x.com/coinco041/status/2034295869802172519" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>Step-by-step bidding guide</a>
                </div>

                <h3 className={classes.guidePhaseHeading} id="auction-closes">3. April 2&nbsp;— Auction Closed <span className={classes.youAreHere}>← you're here</span> <AnchorLink id="auction-closes" /></h3>
                <div className={classes.guidePhaseContent}>
                  <p>Bidding has ended.</p>
                  <p>Check your final bid status and exit from your bid: <a href="https://auctions.zealousswap.com/auctions/igra" target="_blank" rel="noopener noreferrer" className={classes.factLink}>auctions.zealousswap.com/auctions/igra</a></p>
                </div>

                <h3 className={classes.guidePhaseHeading} id="claiming-opens">4. April 9&nbsp;— Claiming <AnchorLink id="claiming-opens" /></h3>
                <div className={classes.guidePhaseContent}>
                  <p>IGRA tokens become claimable.</p>
                  <p>Go to the claiming page and connect the same EVM wallet you used to bid.</p>
                  <p>Claiming page: <em>link&nbsp;— live after auction finalizes</em></p>
                </div>

                <hr className={classes.guideDivider} />

                <p>Need help? Visit the <Link to={to.publicAuction('support')} className={classes.factLink}>Support</Link> page.</p>
              </div>
            ) : activeSection === 'facts' ? (
              <div className={classes.factsTable}>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Max supply</span>
                  <span className={classes.factValue}>10,000,000,000 IGRA</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Total supply</span>
                  <span className={classes.factValue}>1,000,000,000 IGRA (minted to date)</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Token available for sale</span>
                  <span className={classes.factValue}>350,000,000 tokens (3.5% of total supply: 2% from the Igra Association pool and 1.5% from unsubscribed previous sale allocations)</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Network</span>
                  <span className={classes.factValue}><a href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/network-info#igra-mainnet" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra Mainnet</a></span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Token Address</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/token/0x093d77d397F8acCbaee0820345E9E700B1233cD1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0x093d...3cD1
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Payment method</span>
                  <span className={classes.factValue}>iKAS</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Sale format</span>
                  <span className={classes.factValue}>Continuous Clearing Auction</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Floor FDV</span>
                  <span className={classes.factValue}>$60M</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Maximum Bid Amount</span>
                  <span className={classes.factValue}>No max</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Minimum Bid Amount</span>
                  <span className={classes.factValue}>No min</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Staking requirement</span>
                  <span className={classes.factValue}>400,000 IGRA per attester</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Transferability</span>
                  <span className={classes.factValue}>Tokens bought on ZAP become transferable 7 days after ZAP concludes</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Key dates</span>
                  <span className={classes.factValue}>
                    <span className={classes.dateList}>
                      <span>February 25, 2026 — Genesis block minted, TGE</span>
                      <span>March 25, 2026 — ZAP core contract deployment</span>
                      <span>March 26, 2026, 4PM UTC — ZAP auction start</span>
                      <span>April 2, 2026, 4PM UTC — ZAP auction finalized</span>
                      <span>April 9, 2026 — IGRA tokens available for claiming</span>
                    </span>
                  </span>
                </div>
              </div>
            ) : activeSection === 'contracts' ? (
              <div className={classes.factsTable}>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>ContinuousClearingAuction</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0xa1ae5E85551F0093696f32BE6952c2bb23D3068B?tab=index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0xa1ae5E85551F0093696f32BE6952c2bb23D3068B
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Permit2</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0x000000000022D473030F116dDEE9F6B43aC78BA3?tab=index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0x000000000022D473030F116dDEE9F6B43aC78BA3
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>AuctionStateLens</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0xfa458995688c73fc48E7D833483a7206Bed75C27?tab=index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0xfa458995688c73fc48E7D833483a7206Bed75C27
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Query</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0xf40178040278E16c8813dB20a84119A605812FB3?tab=index"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0xf40178040278E16c8813dB20a84119A605812FB3
                    </a>
                  </span>
                </div>
              </div>
            ) : activeSection === 'faq' ? (
              <div className={classes.faqList}>
                <details className={classes.faqItem} open>
                  <summary className={classes.faqQuestion}>What is Igra Network?</summary>
                  <div className={classes.faqAnswer}>
                    <p style={{ marginBottom: 24 }}>Igra Network is a programmable layer on Kaspa BlockDAG, combining Ethereum's flexibility with Bitcoin-grade proof-of-work security.</p>
                    <ul className={classes.guideList} style={{ margin: '0 0 11px' }}>
                      <li><a href="https://docs.hyperlane.xyz/docs/reference/addresses/deployments/mailbox" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Hyperlane official integration</a> with warp routes for stablecoins and blue-chip tokens</li>
                      <li><a href="https://x.com/Igra_Labs/status/2037186175673188854" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Multiple wallets supported</a>, including Ledger and Tangem</li>
                      <li>$KAS collateralization via partner lending protocols: <a href="https://testnet.kaskad.live/" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Kaskad</a>, <a href="https://defi.kaspa.com/lending/dashboard" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Kaspacom</a>, <a href="https://www.fervent.finance/" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Fervent Finance</a></li>
                    </ul>
                    <ul className={classes.guideList} style={{ margin: '0 0 11px' }}>
                      <li>IgReth: custom EVM client with DAG reorg support.</li>
                      <li><a href="https://github.com/IgraLabs/research/blob/main/igra-protocol-leaderless-jan2026.pdf" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>CRDT-based threshold signing protocol</a> for UTXO-to-EVM bridging.</li>
                    </ul>
                    <ul className={classes.guideList} style={{ margin: 0 }}>
                      <li><a href="https://grafana.igralabs.com/public-dashboards/56eb9e43b3854d38b1744f48675a82ac" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Twelve Igra full nodes</a> are live.</li>
                      <li><a href="https://igralabs.com/ecosystem" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Fifteen teams deploy</a> on day one, with $5M TVL and 2,500 proven users.</li>
                      <li>Governed by the <a href="https://igra.network/" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>Igra Association</a> under Swiss law, <a href="https://governance.igralabs.com/" target="_blank" rel="noopener noreferrer" className={classes.whiteLink}>DAO</a> from day one.</li>
                    </ul>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What is $IGRA?</summary>
                  <div className={classes.faqAnswer}>
                    <p>$IGRA is the security and governance token of Igra Network.</p>
                    <p>Attesters stake $IGRA to attest Igra-to-Kaspa state consistency via cryptographic anchors and receive protocol-level incentives, protocol fees and rewards in iKAS and $IGRA.</p>
                    <p>Token holders govern security-critical parameters via Igra DAO: attestation rules, reward and penalty calibration, bridge configuration, and ecosystem grant allocation.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Who is running the ZAP auction?</summary>
                  <div className={classes.faqAnswer}>
                    <p>The auction is operated by ZealousSwap — an independent protocol built on Uniswap's CCA contracts. Igra Labs is launching $IGRA through it, but ZealousSwap owns and operates the ZAP platform. Smart contracts are immutable, have no owner, and cannot be modified once deployed.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What CCA has to do with fair distribution?</summary>
                  <div className={classes.faqAnswer}>
                    <p>Traditional mechanisms set price in one chaotic moment: bots snipe block one, whales move price with liquidity, insiders exit before retail sees the transaction. CCA is different and architecturally closer to fair distribution: tokens stream out block by block, each block clearing at a single market price against active bids. Large capital can't manipulate price through liquidity movements. Price only moves up when real demand requires it.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Which currency was used for bidding?</summary>
                  <div className={classes.faqAnswer}>
                    <p>iKAS, Igra Network's native gas token, pegged 1:1 to KAS.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>How secure are ZAP smart contracts?</summary>
                  <div className={classes.faqAnswer}>
                    <p>ZAP is built on Uniswap's CCA contracts, audited by OpenZeppelin and Spearbit (see <a href="https://github.com/Uniswap/continuous-clearing-auction?tab=readme-ov-file#audits" target="_blank" rel="noopener noreferrer" className={classes.factLink}>audits</a>). Everything that touches funds — bidding, price clearing, exits, refunds, claims — is byte-for-byte identical to that audited code. ZealousSwap added only read-only helper contracts for data querying which hold no funds and execute no state changes.</p>
                    <p>Once the ZAP auction contract is deployed, it's immutable with no owner, and no changes or manipulation is possible.</p>
                    <p>Our team verified the deployed contract on-chain against the public GitHub source. You can do the same.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What's special about this event?</summary>
                  <div className={classes.faqAnswer}>
                    <p>This was the first permissionless distribution of $IGRA. ZAP was open to anyone with an EVM wallet.</p>
                    <p>All previously distributed tokens remain locked as per tokenomics. ZAP participants pay a higher price than any prior round in exchange for immediate liquidity — that premium is the price of no lockup. Fully transferable on claim.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What's the lockup and vesting?</summary>
                  <div className={classes.faqAnswer}>
                    <p>No lockup or vesting for tokens distributed via ZAP. Fully liquid on claim.</p>
                    <p>After the auction closes, there is a short cooldown period before claims open — we use it to deploy DEX liquidity and Hyperlane bridge so both are live the moment you claim. We'll confirm the exact duration closer to launch.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>How do I add Igra Network to my wallet?</summary>
                  <div className={classes.faqAnswer}>
                    <p>Network details (chain ID, RPC, explorer) are on the <a href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/network-info" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Network Info</a> page. You can add it manually or via ChainList. Prefer interacting via agent? Use the <a href="https://igra-labs.gitbook.io/igralabs-docs/quickstart/igra-network-ai-skill" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra Network AI skill</a>.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What is the auction floor price?</summary>
                  <div className={classes.faqAnswer}>
                    <p>It was calculated at auction inception based on a $60M FDV target across the 350M $IGRA offered. The floor price was visible on the ZAP interface throughout the auction.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Will there be more $IGRA auctions on ZAP?</summary>
                  <div className={classes.faqAnswer}>
                    <p>No. This was a one-off event. There was one ZAP auction for $IGRA.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What is the difference between the earlier investor round and ZAP?</summary>
                  <div className={classes.faqAnswer}>
                    <p>The earlier round was private: required KYC, had minimum investment sizes, and carries a 24-month vesting schedule with the first 10% cliff at 6 months from TGE. ZAP is fully public — permissionless, no KYC, no vesting. Tokens are fully transferable immediately after the claim period opens.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Why is attester APY showing 0%?</summary>
                  <div className={classes.faqAnswer}>
                    <p>Intentional. We ran end-to-end attester testing before mainnet. Enabling rewards earlier would have given an unfair advantage to early runners. Rewards were activated via a DAO proposal before the auction. Staking figures on the dashboard are accurate.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Can I interact with ZAP contracts directly without the UI?</summary>
                  <div className={classes.faqAnswer}>
                    <p>Yes — the contract interface is public on GitHub. When the Foundry interaction setup is ready we will publish it. Watch the announcements channel.</p>
                  </div>
                </details>
              </div>
            ) : activeSection === 'attester-calculator' ? (
              <>
                <button className={classes.howToggle} onClick={() => setHowOpen(v => !v)}>
                  <span>How does it work?</span>
                  <svg className={clsx(classes.howChevron, { [classes.howChevronOpen]: howOpen })} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6l4 4 4-4" /></svg>
                </button>
                {howOpen && (
                  <p className={classes.howText}>
                    Adjust stake, network load, node behaviour, and emission parameters to model your expected rewards. Illustrative only: actual returns determined by node performance, smart contract, and protocol configuration. See <a href="https://igra-labs.gitbook.io/igralabs-docs/for-developers/architecture/specifications/igra-attesting-protocol" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Attester Protocol</a> specification for details.
                  </p>
                )}
                <AttesterCalculator />
              </>
            ) : activeSection === 'guides' ? (
              <div className={classes.disclaimerContent}>
                <p>Community-made guides and video tutorials to help you get started.</p>

                <a href="https://x.com/fullface_69/status/2035848626644090964" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ Bridge $KAS to $iKAS</a>
                <a href="https://x.com/fullface_69/status/2034411092965753282" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ ZAP testnet: bidding, exiting &amp; claiming tokens</a>
                <a href="https://youtu.be/LCE9GfP28IA" target="_blank" rel="noopener noreferrer" className={classes.guideArrowLink}>→ ZAP tutorial by Louis (YouTube)</a>
              </div>
            ) : activeSection === 'support' ? (
              <div className={classes.disclaimerContent}>
                <p className={classes.supportDisclaimer}>These are the only official Igra channels and accounts. Be vigilant&nbsp;— do not trust any other sources claiming to represent Igra.</p>

                <h2 className={classes.disclaimerHeading}><Icon name="discord" size={22} className={classes.supportIcon} /> Discord</h2>
                <p>Join the <a href="https://discord.gg/igralabs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra Discord</a> for support and community discussion.</p>

                <h2 className={classes.disclaimerHeading}><Icon name="telegram" size={22} className={classes.supportIcon} /> Telegram</h2>
                <p>The official <a href="https://t.me/IgraCommunity" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Telegram community</a> to ask questions, follow progress, and be part of building the programmable EVM-compatible layer on Kaspa BlockDAG.</p>
                <p>DM the official account: <a href="https://t.me/IgraNetwork" target="_blank" rel="noopener noreferrer" className={classes.factLink}>t.me/IgraNetwork</a></p>

                <h2 className={classes.disclaimerHeading}><Icon name="twitter" size={22} className={classes.supportIcon} /></h2>
                <p>Official account: <a href="https://x.com/Igra_Labs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>x.com/Igra_Labs</a></p>

                <h2 className={classes.disclaimerHeading}><Icon name="email" size={22} className={classes.supportIcon} /></h2>
                <p><a href="mailto:team@igralabs.com" className={classes.factLink}>team@igralabs.com</a></p>
              </div>
            ) : activeSection === 'disclaimer' ? (
              <div className={classes.disclaimerContent}>
                <h2 className={classes.disclaimerHeading}>Auction Sale Terms</h2>
                <p>This token sale is subject to the <a href={to.terms()} className={classes.factLink}>Terms of Service</a> and <a href={to.privacy()} className={classes.factLink}>Privacy Policy</a> and is for consumptive purposes only.</p>

                <h2 className={classes.disclaimerHeading}>Information for Persons in the UK</h2>
                <p>Communications relating to the IGRA token and the IGRA token sale made by Igra Association are directed only at persons outside the UK. Persons in the UK are not permitted to participate in the IGRA token sale and must not act upon any communications made by Igra Association in relation to it or the IGRA token.</p>

                <h2 className={classes.disclaimerHeading}>MiCA Disclaimer</h2>
                <p>Any crypto-asset marketing communications made from this account have not been reviewed or approved by any competent authority in any Member State of the European Union. Igra Association as the offeror of the crypto-asset is solely responsible for the content of such crypto-asset marketing communications. The Igra Association can be contacted at <a href="mailto:legal@igra.network" className={classes.factLink}>legal@igra.network</a>. For more information about the Igra Association, visit <a href="https://igralabs.com" className={classes.factLink}>igralabs.com</a>.</p>

                <h2 className={classes.disclaimerHeading}>Discount Price Disclaimer</h2>
                <p>Any reference to a prior valuation or percentage discount is provided solely to inform potential purchasers of how the initial floor price for the token sale was calculated. Equity financing valuations were determined under specific circumstances that are not comparable to this offering. They do not represent, and should not be relied upon as, the current or future market value of the tokens, nor as an indication of potential returns. The price of tokens may fluctuate substantially, the token may lose its value in part or in full, and purchasers should make independent assessments without reliance on past valuations. No representation or warranty is made that any purchaser will achieve profits or recover the purchase price.</p>

                <h2 className={classes.disclaimerHeading}>Social Media Disclaimer</h2>
                <p>All posts and social media content ("Content") are for entertainment and informational purposes only and do not necessarily express the views of the Igra Association or any of Igra Association's employees or contractors. The Content is not error-free and may contain incorrect information. No advice or information, whether oral or written, obtained from Igra Association, will create any warranty or representation not expressly made herein. You should not rely on any Content for advice of any kind, including legal, investment, financial, tax or other professional advice, and the Content is not a substitute for advice from a qualified professional.</p>
                <p>Any Content does not constitute an offer to sell or the solicitation of an offer to purchase any security. For the avoidance of doubt, the Content is not provided by an investment adviser and are not investment advisory services of Igra Association. Retweets, follows, or likes by Igra Association and Igra Association-related social media accounts are not an endorsement of any idea, individual, group, or entity by Igra Association.</p>
              </div>
            ) : (
              <p className={classes.placeholder}>Content coming soon.</p>
            )}
          </main>
        </div>

        {/* Mobile menu overlay */}
        <div className={clsx(classes.mobileOverlay, { [classes.isOpen]: mobileMenuOpen })}>
          <div className={classes.mobileOverlayHeader}>
            <span className={classes.subHeaderTitle}>Public Auction</span>
            <button className={classes.closeButton} onClick={() => setMobileMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 2L18 18M18 2L2 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className={classes.mobileNav}>
            {sections.map((s) => (
              <Link
                key={s.id}
                to={to.publicAuction(s.id)}
                className={clsx(classes.mobileNavItem, { [classes.active]: activeSection === s.id })}
                onClick={() => {
                  setMobileMenuOpen(false)
                  document.getElementById('root')?.scrollTo({ top: 0 })
                }}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {showModal && (
        <div className={classes.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={classes.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={classes.modalClose} onClick={() => setShowModal(false)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 2L18 18M18 2L2 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className={classes.modalTitle}>IGRA Public Auction</h2>
            <p className={classes.modalBody}>
              IGRA Public Auction launches on March 26, 2026. Till then, join our{' '}
              <a href="https://t.me/IgraCommunity" target="_blank" rel="noopener noreferrer" className={classes.factLink}>
                Telegram
              </a>
              {' '}and watch our{' '}
              <a href="https://x.com/Igra_Labs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>
                X
              </a>
              {' '}for announcements.
            </p>
            <button className={classes.joinButton} onClick={() => setShowModal(false)} style={{ marginTop: 24 }}>
              OK!
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
