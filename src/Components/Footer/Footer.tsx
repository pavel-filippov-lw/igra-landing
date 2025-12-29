import clsx from "clsx"
import { FC, Fragment } from "react"
import { useNavigate } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import { Link } from "../Navigation"
import classes from './Footer.module.scss'

const links: Record<string, Link[]> = {
  'About': [
    { label: 'About Igra', to: to.about(), isPage: true },
    { label: 'Privacy policy', to: to.privacy(), isPage: true },
    { label: 'Terms of use', to: '' },
  ],
  'Research': [
    { label: 'Articles', to: '' },
  ],
  'Community': [
    { label: 'Blog & News', to: '' },
  ],
}

export interface FooterProps {
  className?: string
}

export const Footer: FC<FooterProps> = ({ className }) => {
  const navigate = useNavigate()

  const handleNavigation = (link: Link) => {
    document.getElementById('root')?.scrollTo({
      top: 0,
      behavior: 'instant',
    })
    navigate(link.to)
  }

  return (
    <div className={clsx(classes.root, className)}>
      <Flex justifyContent='space-between' gap={30} className={classes.navigation}>
        {Object.entries(links).map(([title, links], index) => (
          <Flex key={index} flexDirection='column' gap={15}>
            <div className={classes.title}>{title}</div>
            <Flex flexDirection='column' gap={5}>
              {links.map((link, i) => (
                <Fragment key={`${index}-${i}`}>
                  {!!link.isPage ? (
                    <div className={classes.link} onClick={() => handleNavigation(link)}>
                      {link.label}
                    </div>
                  ) : (
                    <a href={link.to} target='_blank' rel='noopener noreferrer'>
                      <div className={classes.link}>
                        {link.label}
                      </div>
                    </a>
                  )}
                </Fragment>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
      <div className={classes.copyright}>
        Copy Igra 2025
      </div>
    </div>
  )
}
