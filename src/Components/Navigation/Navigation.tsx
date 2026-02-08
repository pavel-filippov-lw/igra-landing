import clsx from "clsx"
import { FC, Fragment } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Flex } from "~/shared/ui"

import classes from './Navigation.module.scss'

export interface Link {
  label: string
  to: string
  isPage?: boolean
}

export interface NavigationProps {
  variant?: 'primary' | 'secondary'
  links: Link[]
  className: string
}

export const Navigation: FC<NavigationProps> = ({ className, variant = 'primary', links }) => {
  const navigate = useNavigate()

  const handleNavigation = (link: Link) => {
    document.getElementById('root')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    navigate(link.to)
  }

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
            <div className={classes.route} onClick={() => handleNavigation(link)}>
              {link.label}
            </div>
          ) : (
            <a href={link.to} target='_blank' rel='noopener noreferrer'>
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
