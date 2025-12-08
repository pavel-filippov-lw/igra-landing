import { FC, PropsWithChildren } from "react"

import { Flex } from "~/shared/ui"

import { Footer } from "../Footer"
import { Header } from "../Header"
import classes from './PageLayout.module.scss'

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.radialBg} />
      <Flex flexDirection='column' className={classes.layout}>
        <div className={classes.content}>
          {children}
        </div>
      </Flex>
      <Footer className={classes.footer} />
    </div>
  )
}
