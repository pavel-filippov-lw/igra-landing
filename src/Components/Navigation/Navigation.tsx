import clsx from "clsx"
import { FC, Fragment } from "react"
import { Link } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import classes from './Navigation.module.scss'

const links = [
  { label: 'Ecosystem', to: to.ecosystem(), isPage: true },
  { label: 'Documentation', to: 'https://docs.igralabs.com' },
  { label: 'Team', to: to.team(), isPage: true },
  { label: 'Manifesto', to: to.manifesto(), isPage: true },
  { label: 'Vision', to: to.vision(), isPage: true },
  { label: 'Contact', to: 'mailto:team@igralabs.com' },
]

export interface NavigationProps {
  variant?: 'primary' | 'secondary'
  className: string
}

export const Navigation: FC<NavigationProps> = ({ className, variant = 'primary' }) => {
  return (
    <Flex
      gap={12}
      alignItems='center'
      flexWrap='wrap'
      className={clsx(classes.root, classes[variant], className )}
    >
      {links.map((link, index) => (
        <Fragment key={index}>
          {!!link.isPage ? (
            <Link to={link.to} className={classes.route}>
              {link.label}
            </Link>
          ) : (
            <a href={link.to}>
              <div>
                {link.label}
              </div>
            </a>
          )}
          {index !== links.length - 1 && (
            <div className={classes.separator} />
          )}
        </Fragment>
      ))}
    </Flex>
  )
}
