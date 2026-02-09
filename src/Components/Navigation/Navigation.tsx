import clsx from "clsx"
import { FC, Fragment } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

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
  mobileLinks?: Link[][]
  className: string
}

export const Navigation: FC<NavigationProps> = ({ className, variant = 'primary', links, mobileLinks }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (link: Link) => {
    document.getElementById('root')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    navigate(link.to)
  }

  return (
    <Flex
      alignItems='center'
      flexWrap='wrap'
      className={clsx(classes.root, classes[variant], className )}
    >
      <Flex
        gap={12}
        alignItems='center'
        className={classes.desktopLinks}
      >
        {links.map((link, index) => {
          const isActive = location.pathname === link.to

          return (
            <Fragment key={index}>
              {!!link.isPage ? (
                <div
                  className={clsx(classes.route, { [classes.active]: isActive })}
                  onClick={() => handleNavigation(link)}
                >
                  {link.label}
                </div>
              ) : (
                <a
                  href={link.to}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={classes.externalLink}
                >
                  <div>
                    {link.label}
                  </div>
                </a>
              )}
              {index !== links.length - 1 && (
                <div className={classes.separator} />
              )}
            </Fragment>
          )
        })}
      </Flex>
      <Flex
        flexDirection='column'
        alignItems='center'
        flexWrap='wrap'
        className={classes.mobileLinks}
      >
        {mobileLinks && mobileLinks.map((section, index) => {
          return (
            <Flex
              key={index}
              flexDirection='column'
              gap={12}
              alignItems='center'
            >
              {section.map((link, i) => {
                const isActive = location.pathname === link.to

                return (
                  <Fragment key={`${index}-${i}`}>
                    {!!link.isPage ? (
                      <div
                        className={clsx(classes.route, { [classes.active]: isActive })}
                        onClick={() => handleNavigation(link)}
                      >
                        {link.label}
                      </div>
                    ) : (
                      <a
                        href={link.to}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={classes.externalLink}
                      >
                        <div>
                          {link.label}
                        </div>
                      </a>
                    )}
                    {index !== links.length - 1 && (
                      <div className={classes.separator} />
                    )}
                  </Fragment>
                )})}
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}
