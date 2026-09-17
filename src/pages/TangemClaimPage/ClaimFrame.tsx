import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import heroImg from './assets/hero-tight.png'
import {
  FINAL_WINDOW_ANCHOR,
  GIVEAWAY_RULES_TITLE,
  GiveawayRules,
  PRIVACY_NOTICE_TITLE,
  PrivacyNotice,
} from './legalContent'
import { LegalModal } from './LegalModal'
import classes from './TangemClaimPage.module.scss'

const ELIGIBILITY_SNAPSHOT_URL = 'https://github.com/IgraLabs/tangem-zap-giveaway-2026'

export interface LegalDocs {
  /** Open the Rules modal, optionally scrolled to a section id (e.g. FINAL_WINDOW_ANCHOR). */
  openRules: (anchor?: string) => void
  openPrivacy: () => void
}

const LegalDocsContext = createContext<LegalDocs>({ openRules: () => {}, openPrivacy: () => {} })

/** Open the Rules / Privacy modals from anywhere rendered inside ClaimFrame. */
export const useLegalDocs = (): LegalDocs => useContext(LegalDocsContext)

/** `?rules=<key>` deep links → the Rules section they open at. */
const RULES_DEEP_LINKS: Record<string, string> = { 'final-window': FINAL_WINDOW_ANCHOR }

/**
 * Two-column page shell for the winners' claim flow: title + card on the left,
 * hero illustration on the right, document links in the footer (Rules/Privacy
 * open in-page modals). Renders no wagmi hooks, so it is safe with or without a
 * wallet connection. The card content is passed as children.
 *
 * A shareable `?rules=final-window` URL opens the Rules modal at the final
 * reserve window addendum; children can do the same via `useLegalDocs()`.
 */
export const ClaimFrame: FC<{ children: ReactNode }> = ({ children }) => {
  const [openDoc, setOpenDoc] = useState<'rules' | 'privacy' | null>(null)
  const [rulesAnchor, setRulesAnchor] = useState<string | undefined>()

  const openRules = useCallback((anchor?: string) => {
    setRulesAnchor(anchor)
    setOpenDoc('rules')
  }, [])
  const openPrivacy = useCallback(() => setOpenDoc('privacy'), [])
  const close = useCallback(() => {
    setOpenDoc(null)
    setRulesAnchor(undefined)
  }, [])

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('rules')
    const anchor = key ? RULES_DEEP_LINKS[key] : undefined
    if (anchor) openRules(anchor)
  }, [openRules])

  const docs = useMemo<LegalDocs>(() => ({ openRules, openPrivacy }), [openRules, openPrivacy])

  return (
    <LegalDocsContext.Provider value={docs}>
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
              <button type="button" onClick={() => openRules()}>
                Giveaway rules
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={openPrivacy}>
                Privacy notice
              </button>
            </nav>
          </div>

          <div className={classes.hero} aria-hidden="true">
            <img src={heroImg} alt="" className={classes.heroImg} />
          </div>
        </div>

        {openDoc === 'rules' && (
          <LegalModal title={GIVEAWAY_RULES_TITLE} onClose={close} scrollTo={rulesAnchor}>
            <GiveawayRules />
          </LegalModal>
        )}
        {openDoc === 'privacy' && (
          <LegalModal title={PRIVACY_NOTICE_TITLE} onClose={close}>
            <PrivacyNotice />
          </LegalModal>
        )}
      </div>
    </LegalDocsContext.Provider>
  )
}
