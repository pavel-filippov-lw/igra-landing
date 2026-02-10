import clsx from "clsx"
import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import { Logo } from "../Logo"
import { Navigation } from "../Navigation"
import { Socials } from "../Socials"
import classes from './Header.module.scss'

const links = [
  { label: 'Ecosystem', to: to.ecosystem(), isPage: true },
  { label: 'Documentation', to: 'https://igra-labs.gitbook.io/' },
  { label: '$IGRA', to: to.igraToken(), isPage: true },
]

const mobileLinks = [
  [
    { label: 'Team', to: to.team(), isPage: true },
    { label: 'Manifesto', to: to.manifesto(), isPage: true },
    { label: 'Vision', to: to.vision(), isPage: true },
  ],
  [
    { label: 'Privacy Policy', to: to.privacy(), isPage: true },
    { label: 'Terms of Use', to: '#' },
  ],
]

export const Header: FC = () => {
  const navigate = useNavigate()
  const [isVisibleMenu, setIsVisibleMenu] = useState(false)

  return (
    <div className={classes.root}>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        className={classes.content}
      >
        <Logo onClick={() => navigate(to.hero())} />
        <Flex gap={50} alignItems='center'>
          <div
            className={clsx(classes.hamburger, {
              [classes.isActive]: isVisibleMenu,
            })}
            onClick={() => setIsVisibleMenu(!isVisibleMenu)}
          />
          <Navigation
            links={links}
            mobileLinks={mobileLinks}
            className={clsx(classes.navigation, {
              [classes.isVisible]: isVisibleMenu,
            })}
          />
          <div className={classes.separator} />
          <Socials
            className={clsx(classes.socials, {
              [classes.isVisible]: isVisibleMenu,
            })}
          />
        </Flex>
      </Flex>
    </div>
  )
}
