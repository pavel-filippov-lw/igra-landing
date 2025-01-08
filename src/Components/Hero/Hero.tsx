import { FC } from "react"

import { Flex } from "~/shared/ui"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import heroVideo from './assets/hero.webm'
import classes from './Hero.module.scss'

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <Flex className={classes.layout}>
        <div className={classes.leftSide}>
          <HeroContent className={classes.content} />
          <HeroBenefits />
        </div>
        <video
          autoPlay
          muted
          loop
          className={classes.video}
        >
          <source src={heroVideo} type="video/webm" />
        </video>
      </Flex>
    </div>
  )
}
