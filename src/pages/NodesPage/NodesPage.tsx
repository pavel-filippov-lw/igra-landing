import { FC } from "react"

import { LiveNodesMap, PageLayout } from "~/Components"

import classes from './NodesPage.module.scss'

export const NodesPage: FC = () => {
  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        <h1 className={classes.title}>Igra Nodes Live</h1>
        <LiveNodesMap />
      </div>
    </PageLayout>
  )
}
