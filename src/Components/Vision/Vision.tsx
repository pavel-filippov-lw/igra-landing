import { FC } from "react"

import { Flex } from "~/shared/ui"

import { VisionBenefits } from "../VisionBenefits"
import classes from './Vision.module.scss'

export const Vision: FC = () => {
  return (
    <div className={classes.root}>
      <Flex className={classes.content}>
        <div className={classes.leftSide}>
          <h1 className={classes.title}>Vision</h1>
          <div className={classes.description}>
            Igra's endgame is to deliver a platform that combines
            Bitcoin-grade security with the versatility of modern programmable chains.
            We aim to unify any kind of decentralized VMs under one roof,
            making them secure, ultra-fast, MEV-resistant and interoperable.
          </div>
        </div>
        <div className={classes.image} />
      </Flex>
      <VisionBenefits />
    </div>
  )
}
