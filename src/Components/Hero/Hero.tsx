import { FC } from "react"

import { Flex } from "~/shared/ui"

import { HeroBenefits } from "../HeroBenefits"
import { HeroContent } from "../HeroContent"
import heroImage from './assets/hero.png'
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
        <div className={classes.image} style={{ background: `center / contain no-repeat url(${heroImage})` }} />
        <video
          autoPlay
          muted
          loop
          playsInline
          className={classes.video}
        >
          <source src={heroVideo} type="video/webm" />
        </video>
      </Flex>
    </div>
  )
}
