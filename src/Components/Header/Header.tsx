import clsx from "clsx"
import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import { Logo } from "../Logo"
import { Navigation } from "../Navigation"
import { Socials } from "../Socials"
import classes from './Header.module.scss'

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
