import clsx from "clsx"
import { FC } from "react"

import { Navigation } from "../Navigation"
import classes from './Footer.module.scss'

export interface FooterProps {
  className?: string
}

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <div className={clsx(classes.root, className)}>
      <Navigation
        className={classes.navigation}
        variant="secondary"
      />
      <div className={classes.copyright}>
        &copy; 2024-2025 Igra Labs
      </div>
    </div>
  )
}
