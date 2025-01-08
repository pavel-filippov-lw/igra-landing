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
        <HeroContent className={classes.content} />
        <video
          autoPlay
          muted
          loop
          className={classes.video}
        >
          <source src={heroVideo} type="video/webm" />
        </video>
      </Flex>
      <HeroBenefits />
    </div>
  )
}
