import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

import { to } from "~/shared/lib"
import { Flex } from "~/shared/ui"

import { Footer } from "../Footer"
import { Header } from "../Header"
import classes from './PageLayout.module.scss'

export interface PageLayoutProps extends PropsWithChildren {
  hideBg?: boolean
}

export const PageLayout: FC<PageLayoutProps> = ({ children, hideBg }) => {
  const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') && location.pathname === to.hero()

  return (
    <div className={classes.root}>
      <Header />
      {!hideBg && <div className={clsx(classes.radialBg, { [classes.isSafari]: isSafari })} />}
      <Flex flexDirection='column' className={classes.layout}>
        <div className={classes.content}>
          {children}
        </div>
      </Flex>
      <Footer className={classes.footer} />
    </div>
  )
}
