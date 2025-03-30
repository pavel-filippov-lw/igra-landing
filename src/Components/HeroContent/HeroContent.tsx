import clsx from "clsx"
import { FC } from "react"

import { Flex } from "~/shared/ui"

import classes from './HeroContent.module.scss'

export interface HeroContentProps {
  className: string
}

export const HeroContent: FC<HeroContentProps> = ({ className }) => {
  return (
    <Flex
      flexDirection='column'
      gap={34}
      className={clsx(classes.root, className)}
    >
      <Flex flexDirection='column' gap={24}>
        <h1 className={classes.title}>
          Defy DeFi limitations
        </h1>
        <h2 className={classes.subtitle}>
          Atomic programmability on a based rollup leveraging Kaspa BlockDAG.
        </h2>
        <div className={classes.description}>
          A chain for builders who want to build without limitations
        </div>
      </Flex>
    </Flex>
  )
}
