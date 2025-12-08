import { FC } from "react"

import { GlitchText } from "../GlitchText"
import heroVideo from './assets/video.mov'
import heroVideoSafari from './assets/video.webm'
import classes from './Hero.module.scss'

const glitchTextLines = [
  'fastest',
  'fairest',
  'most secure',
  'most credibly neutral',
]

export const Hero: FC = () => {
  return (
    <div className={classes.root}>
      <div
        className={classes.content}
      >
        <div className={classes.title}>
          {`The `}
          <GlitchText
            lines={glitchTextLines}
            className={classes.glitchText}
          />
          {` programmable PoW chain.`}
        </div>
        <div className={classes.note}>
          <div className={classes.date}>20 NOV 2025</div>
          <div className={classes.noteTitle}>Come sail your ships around me</div>
          <div className={classes.description}>
            Ahoy! Our ship has crossed rough waters-reorgs, battles for storage, and a cold restart iceberg.
          </div>
        </div>
      </div>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className={classes.video}
      >
        <source src={heroVideo} type="video/mp4; codecs=&quot;hvc1&quot;" />
        <source src={heroVideoSafari} type="video/webm" />
      </video>
    </div>
  )
}
