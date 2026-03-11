import clsx from "clsx"
import { FC, useState } from "react"
import { PageLayout } from "~/Components"
import { to } from "~/shared/lib"
import { Button, Flex } from "~/shared/ui"

import classes from './PublicAuctionPage.module.scss'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-to-participate', label: 'How to participate' },
  { id: 'facts', label: 'Facts' },
  { id: 'contracts', label: 'Contract Addresses' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'faq', label: 'FAQ' },
  { id: 'support', label: 'Support' },
  { id: 'disclaimer', label: 'Disclaimer' },
]

export const PublicAuctionPage: FC = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSectionClick = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
  }

  const activeLabel = sections.find(s => s.id === activeSection)?.label ?? 'Overview'

  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        {/* Auction sub-header */}
        <div className={classes.subHeader}>
          <Flex alignItems='center' gap={16}>
            <div
              className={classes.hamburger}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span />
              <span />
              <span />
            </div>
            <span className={classes.subHeaderTitle}>Public Auction</span>
          </Flex>
          <Button className={classes.ctaButton}>
            Join Public Auction
          </Button>
        </div>

        <div className={classes.body}>
          {/* Desktop sidebar */}
          <aside className={classes.sidebar}>
            <nav>
              {sections.map((s) => (
                <button
                  key={s.id}
                  className={clsx(classes.navItem, { [classes.active]: activeSection === s.id })}
                  onClick={() => handleSectionClick(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content area */}
          <main className={classes.content}>
            <h1 className={classes.pageTitle}>{activeLabel}</h1>
            {activeSection === 'overview' ? (
              <div className={classes.disclaimerContent}>
                <p>All you need to know about the IGRA Public Auction.</p>
                <p>The IGRA Public Auction is a Continuous Clearing Auction (CCA), built on Uniswap's battle-tested and audited code. Tokens stream out block by block, each block clearing at a single market price against active bids. This ensures fair price discovery — large capital can't manipulate price through liquidity movements, and price only moves up when real demand requires it.</p>

                <h2 className={classes.disclaimerHeading}>Important dates</h2>
                <p>
                  <strong>Genesis block minted, TGE:</strong> February 25, 2025<br />
                  <strong>ZAP contract deployment:</strong> March 30, 2025<br />
                  <strong>ZAP auction finalized:</strong> April 5, 2025<br />
                  <strong>IGRA tokens available for claiming:</strong> April 12, 2025
                </p>

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
                <h2 className={classes.disclaimerHeading}>1. Wrap KAS into iKAS using permissionless bridges:</h2>
                <ul className={classes.guideList}>
                  <li><a href="https://katbridge.io" target="_blank" rel="noopener noreferrer" className={classes.factLink}>KAT bridge</a></li>
                  <li><a href="https://kasware.xyz" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasware</a></li>
                  <li><a href="https://kasperia.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Kasperia</a></li>
                  <li><a href="https://docs.igralabs.com" target="_blank" rel="noopener noreferrer" className={classes.factLink}>Send tx via CLI</a></li>
                </ul>

                <h2 className={classes.disclaimerHeading}>2. Navigate to ZAP page and place a bid</h2>
              </div>
            ) : activeSection === 'facts' ? (
              <div className={classes.factsTable}>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Total supply</span>
                  <span className={classes.factValue}>10,000,000,000 IGRA</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Token available for sale</span>
                  <span className={classes.factValue}>500,000,000 tokens (5% of total supply)</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Network</span>
                  <span className={classes.factValue}>Igra Mainnet</span>
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
                  <span className={classes.factValue}>No max.</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Minimum Bid Amount</span>
                  <span className={classes.factValue}>No min.</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Staking requirement</span>
                  <span className={classes.factValue}>400,000 IGRA per attester</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Transferability</span>
                  <span className={classes.factValue}>Tokens become transferable 1 week after ZAP commences</span>
                </div>
                <div className={classes.factRow}>
                  <span className={classes.factLabel}>Key dates</span>
                  <span className={classes.factValue}>
                    <span className={classes.dateList}>
                      <span>25 Feb 2025 — Genesis block minted, TGE</span>
                      <span>30 Mar 2025 — ZAP contract deployment</span>
                      <span>5 Apr 2025 — ZAP auction finalized</span>
                      <span>12 Apr 2025 — IGRA tokens available for claiming</span>
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
              <div className={classes.disclaimerContent}>
                <h2 className={classes.disclaimerHeading}>What is $IGRA?</h2>
                <p>$IGRA is the security and governance token of Igra Network.</p>
                <p>Attesters stake $IGRA to attest Igra-to-Kaspa state consistency via cryptographic anchors and receive protocol-level incentives, protocol fees and rewards in iKAS and $IGRA.</p>
                <p>Token holders govern security-critical parameters via Igra DAO: attestation rules, reward and penalty calibration, bridge configuration, and ecosystem grant allocation.</p>

                <h2 className={classes.disclaimerHeading}>How to participate?</h2>
                <p>Here is the <button className={classes.inlineLink} onClick={() => handleSectionClick('how-to-participate')}>full guide</button>.</p>

                <h2 className={classes.disclaimerHeading}>What CCA has to do with fair distribution?</h2>
                <p>Traditional mechanisms set price in one chaotic moment: bots snipe block one, whales move price with liquidity, insiders exit before retail sees the transaction. CCA is different and architecturally closer to fair distribution: tokens stream out block by block, each block clearing at a single market price against active bids. Large capital can't manipulate price through liquidity movements. Price only moves up when real demand requires it.</p>

                <h2 className={classes.disclaimerHeading}>Which currency will be used for bidding?</h2>
                <p>iKAS, Igra Network's native gas token, pegged 1:1 to KAS.</p>

                <h2 className={classes.disclaimerHeading}>How secure are ZAP smart contracts?</h2>
                <p>ZAP is built on Uniswap's CCA contracts, audited by OpenZeppelin and Spearbit (see <a href="https://github.com/Uniswap/continuous-clearing-auction?tab=readme-ov-file#audits" target="_blank" rel="noopener noreferrer" className={classes.factLink}>audits</a>). Everything that touches funds — bidding, price clearing, exits, refunds, claims — is byte-for-byte identical to that audited code. ZealousSwap added only read-only helper contracts for data querying which hold no funds and execute no state changes.</p>
                <p>Once the ZAP auction contract is deployed, it's immutable with no owner, and no changes or manipulation is possible.</p>
                <p>Before the auction opens, our team will verify the deployed contract on-chain against the public GitHub source. You can and should do the same.</p>

                <h2 className={classes.disclaimerHeading}>What's special about this event?</h2>
                <p>This is the first permissionless distribution of $IGRA. ZAP is open to anyone with an EVM wallet.</p>
                <p>All previously distributed tokens remain locked as per tokenomics. ZAP participants pay a higher price than any prior round in exchange for immediate liquidity — that premium is the price of no lockup. Fully transferable on claim.</p>

                <h2 className={classes.disclaimerHeading}>What's the lockup and vesting?</h2>
                <p>No lockup or vesting for tokens distributed via ZAP. Fully liquid on claim.</p>
                <p>After the auction closes, there is a short cooldown period before claims open — we use it to deploy DEX liquidity and Hyperlane bridge so both are live the moment you claim. We'll confirm the exact duration closer to launch.</p>
              </div>
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
              <button
                key={s.id}
                className={clsx(classes.mobileNavItem, { [classes.active]: activeSection === s.id })}
                onClick={() => handleSectionClick(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </PageLayout>
  )
}
