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
      <Flex flexDirection='column' gap={16}>
        <h1 className={classes.title}>
          Realtime programmable layer atop of PoW
        </h1>
        <h2 className={classes.subtitle}>
          Igra Network unlock use cases for both retail
          and institutional users that weren&rsquo;t feasible until now
        </h2>
      </Flex>
      <button className={classes.button}>
        read litepaper
      </button>
    </Flex>
  )
}
