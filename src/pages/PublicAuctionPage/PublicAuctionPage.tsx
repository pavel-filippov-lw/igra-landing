import clsx from "clsx"
import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"

import { PageLayout } from "~/Components"
import { to } from "~/shared/lib"
import { Button, Flex } from "~/shared/ui"

import classes from './PublicAuctionPage.module.scss'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'facts', label: 'Facts' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'faq', label: 'FAQ' },
  { id: 'support', label: 'Support' },
]

export const PublicAuctionPage: FC = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSectionClick = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
  }

  const handleTermsClick = () => {
    setMobileMenuOpen(false)
    document.getElementById('root')?.scrollTo({ top: 0, behavior: 'instant' })
    navigate(to.terms())
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
              <button
                className={classes.navItem}
                onClick={handleTermsClick}
              >
                Terms
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={classes.externalIcon}>
                  <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </nav>
          </aside>

          {/* Content area */}
          <main className={classes.content}>
            <h1 className={classes.pageTitle}>{activeLabel}</h1>
            <p className={classes.placeholder}>Content coming soon.</p>
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
            <button
              className={classes.mobileNavItem}
              onClick={handleTermsClick}
            >
              Terms
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={classes.externalIcon}>
                <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </PageLayout>
  )
}
