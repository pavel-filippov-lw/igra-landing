import { FC } from "react"

import { Flex } from "~/shared/ui"

import { Logo } from "../Logo"
import { Navigation } from "../Navigation"
import { Socials } from "../Socials"
import classes from './Header.module.scss'

export const Header: FC = () => {
  return (
    <div className={classes.root}>
      <Flex
        justifyContent='space-between'
        alignItems='center'
        className={classes.content}
      >
        <Logo />
        <Flex gap={35} alignItems='center'>
          <Navigation />
          <div className={classes.separator} />
          <Socials />
        </Flex>
      </Flex>
    </div>
  )
}
