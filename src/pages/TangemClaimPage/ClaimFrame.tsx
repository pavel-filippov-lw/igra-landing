import { FC, ReactNode, useEffect, useState } from 'react'

import heroImg from './assets/hero-tight.png'
import {
  CLOSING_NOTICE_ID,
  GIVEAWAY_RULES_TITLE,
  GiveawayRules,
  PRIVACY_NOTICE_TITLE,
  PrivacyNotice,
} from './legalContent'
import { LegalModal } from './LegalModal'
import classes from './TangemClaimPage.module.scss'

const ELIGIBILITY_SNAPSHOT_URL = 'https://github.com/IgraLabs/tangem-zap-giveaway-2026'

/**
 * Two-column page shell for the winners' claim flow: title + card on the left,
 * hero illustration on the right, document links in the footer (Rules/Privacy
 * open in-page modals). Renders no wagmi hooks, so it is safe with or without a
 * wallet connection. The card content is passed as children.
 *
 * Once the giveaway has `concluded`, the Rules start with the closing notice and
 * `#closing-notice` in the URL (a shared link or the landing's link) opens them there.
 */
export const ClaimFrame: FC<{ children: ReactNode; concluded?: boolean }> = ({ children, concluded = false }) => {
  const [openDoc, setOpenDoc] = useState<'rules' | 'privacy' | null>(null)
  const [scrollTo, setScrollTo] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!concluded) return
    const openNotice = () => {
      if (window.location.hash !== `#${CLOSING_NOTICE_ID}`) return
      setScrollTo(CLOSING_NOTICE_ID)
      setOpenDoc('rules')
    }
    openNotice()
    window.addEventListener('hashchange', openNotice)
    return () => window.removeEventListener('hashchange', openNotice)
  }, [concluded])

  const closeDoc = () => {
    setOpenDoc(null)
    setScrollTo(undefined)
    // Drop the anchor so the same link opens the notice again next time.
    if (window.location.hash === `#${CLOSING_NOTICE_ID}`) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }
  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        <div className={classes.left}>
          <h1 className={classes.title}>Igra × Tangem Giveaway</h1>

          <div className={classes.card}>{children}</div>

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
        <LegalModal title={GIVEAWAY_RULES_TITLE} onClose={closeDoc} scrollTo={scrollTo}>
          <GiveawayRules closingNotice={concluded} />
        </LegalModal>
      )}
      {openDoc === 'privacy' && (
        <LegalModal title={PRIVACY_NOTICE_TITLE} onClose={closeDoc}>
          <PrivacyNotice />
        </LegalModal>
      )}
    </div>
  )
}
