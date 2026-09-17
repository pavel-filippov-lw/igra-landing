import { FC, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

import classes from './LegalModal.module.scss'

/**
 * Scrollable modal for the giveaway legal documents (Rules, Privacy Notice).
 * Long content scrolls inside the modal body; a fixed header keeps the title +
 * close button visible. Closes on backdrop click, the ✕ button, or Escape.
 */
export const LegalModal: FC<{
  title: string
  onClose: () => void
  /** Element id inside the document to scroll into view once open (deep links). */
  scrollTo?: string
  children: ReactNode
}> = ({ title, onClose, scrollTo, children }) => {
  // Deep link: bring the requested section to the top of the scrollable body.
  useEffect(() => {
    if (!scrollTo) return
    const id = requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [scrollTo])

  // Close on Escape, and lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div className={classes.backdrop} onClick={onClose} role="presentation">
      <div
        className={classes.card}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          <button type="button" className={classes.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={classes.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
