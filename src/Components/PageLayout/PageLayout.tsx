import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

import { Flex } from "~/shared/ui"

import { Footer } from "../Footer"
import { Header } from "../Header"
import classes from './PageLayout.module.scss'

export const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')

  return (
    <div className={classes.root}>
      <Header />
      <div className={clsx(classes.radialBg, { [classes.isSafari]: isSafari })} />
      <Flex flexDirection='column' className={classes.layout}>
        <div className={classes.content}>
          {children}
        </div>
      </Flex>
      <Footer className={classes.footer} />
    </div>
  )
}
