import { FC, ReactNode, useState } from 'react'

import heroImg from './assets/hero-tight.png'
import {
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
 */
export const ClaimFrame: FC<{ children: ReactNode }> = ({ children }) => {
  const [openDoc, setOpenDoc] = useState<'rules' | 'privacy' | null>(null)
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
        <LegalModal title={GIVEAWAY_RULES_TITLE} onClose={() => setOpenDoc(null)}>
          <GiveawayRules />
        </LegalModal>
      )}
      {openDoc === 'privacy' && (
        <LegalModal title={PRIVACY_NOTICE_TITLE} onClose={() => setOpenDoc(null)}>
          <PrivacyNotice />
        </LegalModal>
      )}
    </div>
  )
}
