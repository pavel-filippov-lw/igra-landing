import { FC, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

import classes from './LegalModal.module.scss'

/**
 * Scrollable modal for the giveaway legal documents (Rules, Privacy Notice).
 * Long content scrolls inside the modal body; a fixed header keeps the title +
 * close button visible. Closes on backdrop click, the ✕ button, or Escape.
 */
export const LegalModal: FC<{ title: string; onClose: () => void; children: ReactNode }> = ({
  title,
  onClose,
  children,
}) => {
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
