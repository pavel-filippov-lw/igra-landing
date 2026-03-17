import clsx from "clsx"
import { FC, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { PageLayout } from "~/Components"
import { to } from "~/shared/lib"

import { AttesterCalculator } from './AttesterCalculator'
import classes from './PublicAuctionPage.module.scss'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'facts', label: 'Facts' },
  { id: 'faq', label: 'FAQ' },
  { id: 'attester-calculator', label: 'Attester Calculator' },
  { id: 'support', label: 'Support' },
]

const validSections = new Set(sections.map(s => s.id))

export const PublicAuctionPage: FC = () => {
  const { section } = useParams<{ section?: string }>()
  const activeSection = section && validSections.has(section) ? section : 'overview'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [howOpen, setHowOpen] = useState(false)

  const handleJoinClick = () => {
    window.plausible?.('JoinAuctionClick')
    setShowModal(true)
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
          <main className={clsx(classes.content, { [classes.contentWide]: activeSection === 'attester-calculator' })}>
            {activeSection === 'overview' ? (
              <div className={classes.titleRowOverview}>
                <button className={classes.joinButton} onClick={handleJoinClick}>
                  Join Public Auction <span className={classes.chevron}>›</span>
                </button>
                <h1 className={classes.pageTitle}>{activeLabel}</h1>
              </div>
            ) : (
              <div className={classes.titleRow}>
                <div>
                  <span className={classes.pageSuperTitle}>Public Auction:</span>
                  <h1 className={classes.pageTitle}>{activeLabel}</h1>
                </div>
                <button className={classes.joinButton} onClick={handleJoinClick}>
                  Join Public Auction <span className={classes.chevron}>›</span>
                </button>
              </div>
            )}
            {activeSection === 'overview' ? (
              <div className={classes.disclaimerContent}>
                <p><strong>All you need to know about the IGRA Public Auction.</strong></p>
                <p>The IGRA Public Auction is a Continuous Clearing Auction (CCA), built on Uniswap's battle-tested and audited <a href="https://docs.uniswap.org/contracts/liquidity-launchpad/CCA" target="_blank" rel="noopener noreferrer" className={classes.factLink}>code</a>.</p>
                <p>Tokens stream out block by block, each block clearing at a single market price against active bids. This ensures fair price discovery - large capital can't manipulate price through liquidity movements, and price only moves up when real demand requires it.</p>

                <h2 className={classes.disclaimerHeading}>Important dates</h2>
                <div className={classes.datesTable}>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>Genesis block minted, TGE</span><span className={classes.dateValue}>February 25, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP core contract deployment</span><span className={classes.dateValue}>March 4, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP auction start</span><span className={classes.dateValue}>March 26, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>ZAP auction finalized</span><span className={classes.dateValue}>April 1, 2026</span></div>
                  <div className={classes.dateRow}><span className={classes.dateLabel}>IGRA tokens available for claiming</span><span className={classes.dateValue}>April 8, 2026</span></div>
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
              <p className={classes.placeholder}>Content coming soon.</p>
              /* TODO: restore "How to participate" content
              <div className={classes.disclaimerContent}>
                <h2 className={classes.disclaimerHeading}>1. Wrap KAS into iKAS using permissionless bridges:</h2>
                <ul className={classes.guideList}>
                  <li><a href="https://katbridge.io" target="_blank" rel="noopener noreferrer" className={classes.factLink}>KAT bridge</a></li>
                  <li><a href="https://kasware.xyz" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasware</a></li>
                  <li><a href="https://kasperia.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasperia</a></li>
                  <li><a href="https://docs.igralabs.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Send tx via CLI</a></li>
                </ul>

                <h2 className={classes.disclaimerHeading}>2. Navigate to ZAP page and place a bid</h2>
              </div>
              */
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
                  <span className={classes.factValue}>350,000,000 tokens (3.5% of total supply)</span>
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
                      <span>March 4, 2026 — ZAP core contract deployment</span>
                      <span>March 26, 2026 — ZAP auction start</span>
                      <span>April 1, 2026 — ZAP auction finalized</span>
                      <span>April 8, 2026 — IGRA tokens available for claiming</span>
                    </span>
                  </span>
                </div>
              </div>
            ) : activeSection === 'contracts' ? (
              <div className={classes.factsTable}>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Permit2</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0x000000000022D473030F116dDEE9F6B43aC78BA3?tab=contract"
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
                      href="https://explorer.igralabs.com/address/0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0x1a2b3c4d5e6f7890abcdef1234567890abcdef12
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Query</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0x2b3c4d5e6f7890abcdef1234567890abcdef1234"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0x2b3c4d5e6f7890abcdef1234567890abcdef1234
                    </a>
                  </span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>ContinuousClearingAuction</span>
                  <span className={classes.factValue}>
                    <a
                      href="https://explorer.igralabs.com/address/0x3c4d5e6f7890abcdef1234567890abcdef123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes.factLink}
                    >
                      0x3c4d5e6f7890abcdef1234567890abcdef123456
                    </a>
                  </span>
                </div>
              </div>
            ) : activeSection === 'faq' ? (
              <div className={classes.faqList}>
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
                  <summary className={classes.faqQuestion}>Which currency will be used for bidding?</summary>
                  <div className={classes.faqAnswer}>
                    <p>iKAS, Igra Network's native gas token, pegged 1:1 to KAS.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>How secure are ZAP smart contracts?</summary>
                  <div className={classes.faqAnswer}>
                    <p>ZAP is built on Uniswap's CCA contracts, audited by OpenZeppelin and Spearbit (see <a href="https://github.com/Uniswap/continuous-clearing-auction?tab=readme-ov-file#audits" target="_blank" rel="noopener noreferrer" className={classes.factLink}>audits</a>). Everything that touches funds — bidding, price clearing, exits, refunds, claims — is byte-for-byte identical to that audited code. ZealousSwap added only read-only helper contracts for data querying which hold no funds and execute no state changes.</p>
                    <p>Once the ZAP auction contract is deployed, it's immutable with no owner, and no changes or manipulation is possible.</p>
                    <p>Before the auction opens, our team will verify the deployed contract on-chain against the public GitHub source. You can and should do the same.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>What's special about this event?</summary>
                  <div className={classes.faqAnswer}>
                    <p>This is the first permissionless distribution of $IGRA. ZAP is open to anyone with an EVM wallet.</p>
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
                    <p>It will be calculated at auction inception based on a $60M FDV target across the 350M $IGRA offered — the exact KAS equivalent depends on the KAS/USD rate at that moment. Once the auction opens, the floor is visible on the ZAP interface.</p>
                  </div>
                </details>
                <details className={classes.faqItem}>
                  <summary className={classes.faqQuestion}>Will there be more $IGRA auctions on ZAP after March 26?</summary>
                  <div className={classes.faqAnswer}>
                    <p>No. This is a one-off event. There is one ZAP auction scheduled for $IGRA.</p>
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
                    <p>Intentional. We are running end-to-end attester testing before mainnet. Enabling rewards now would give an unfair advantage to early runners over those who start after launch. Rewards will be activated via a DAO proposal before the auction. Staking figures on the dashboard are accurate.</p>
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
            ) : activeSection === 'support' ? (
              <div className={classes.disclaimerContent}>
                <h2 className={classes.disclaimerHeading}>Discord</h2>
                <p>Join the <a href="https://discord.gg/igralabs" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Igra Discord</a> for support and community discussion.</p>

                <h2 className={classes.disclaimerHeading}>Telegram</h2>
                <p>The official <a href="https://t.me/IgraCommunity" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Telegram community</a> to ask questions, follow progress, and be part of building the programmable EVM-compatible layer on Kaspa BlockDAG.</p>
                <p>DM the official account: <a href="https://t.me/IgraNetwork" target="_blank" rel="noopener noreferrer" className={classes.factLink}>t.me/IgraNetwork</a></p>

                <h2 className={classes.disclaimerHeading}>Email</h2>
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
