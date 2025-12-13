import clsx from "clsx"
import { FC } from "react"

import { to } from "~/shared/lib"

import { Navigation } from "../Navigation"
import classes from './Footer.module.scss'

const links = [
  { label: 'Ecosystem', to: to.ecosystem(), isPage: true },
  { label: 'Features', to: to.benefits(), isPage: true },
  { label: 'Documentation', to: 'https://docs.igralabs.com' },
  { label: 'Team', to: to.team(), isPage: true },
  { label: 'Manifesto', to: to.manifesto(), isPage: true },
  { label: 'Vision', to: to.vision(), isPage: true },
  { label: 'Contact', to: 'mailto:team@igralabs.com' },
]

export interface FooterProps {
  className?: string
}

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <div className={clsx(classes.root, className)}>
      <Navigation
        variant="secondary"
        links={links}
        className={classes.navigation}
      />
      <div className={classes.copyright}>
        &copy; 2024-2025 Igra Labs
      </div>
    </div>
  )
}
