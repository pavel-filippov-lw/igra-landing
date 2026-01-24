import clsx from "clsx"
import { FC, Fragment } from "react"
import { useNavigate } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import { Link } from "../Navigation"
import classes from './Footer.module.scss'

const links: Record<string, Link[]> = {
  '': [
    { label: 'Ecosystem', to: to.ecosystem(), isPage: true },
    { label: 'Documentation', to: 'https://igra-labs.gitbook.io/' },
    { label: 'What is $IGRA', to: to.igraToken(), isPage: true },
    { label: 'Contact', to: 'mailto:team@igralabs.com' },
  ],
  ' ': [
    { label: 'Team', to: to.team(), isPage: true },
    { label: 'Manifesto', to: to.manifesto(), isPage: true },
    { label: 'Vision', to: to.vision(), isPage: true },
  ],
  '  ': [
    { label: 'X.com', to: 'https://x.com/igra_labs' },
    { label: 'Discord', to: 'https://discord.com/invite/igra' },
    { label: 'Github', to: 'https://github.com/igralabs' },
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
        <a href={to.privacy()} className={classes.copyrightLink}>Privacy Policy</a>
        <span className={classes.separator}>·</span>
        <a href="#" className={classes.copyrightLink}>Terms of Use</a>
        <span className={classes.copyrightText}>© 2026 Igra Labs</span>
      </div>
    </div>
  )
}
