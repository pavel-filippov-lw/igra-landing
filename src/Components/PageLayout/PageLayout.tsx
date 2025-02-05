import { FC, PropsWithChildren } from "react"

import { Flex } from "~/shared/ui"

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
        <div className={classes.copyright}>
          &copy; 2024-2025 Igra Labs
        </div>
      </Flex>
    </div>
  )
}
