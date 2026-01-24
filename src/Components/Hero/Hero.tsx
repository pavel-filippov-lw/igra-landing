import { FC } from "react"


import { GlitchText } from "../GlitchText"
import heroVideoSafari from './assets/video_alpha.mov'
import heroVideo from './assets/video_alpha.webm'
import classes from './Hero.module.scss'

const glitchTextLines = [
  'fastest',
  'fairest',
  'most secure',
  'only realtime',
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
          {`programmable PoW chain.`}
        </div>
        <div className={classes.note}>
          <div className={classes.noteContent}>
            <span className={classes.date}>14 JAN 2026</span>
            <span className={classes.noteText}>
              Galleon closed mainnet is live. <a href="#" className={classes.readMore}>Read more.</a>
            </span>
          </div>
        </div>
      </div>
      <div className={classes.videoWrapper}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
          className={classes.video}
        >
          <source src={heroVideoSafari} type="video/mp4; codecs=&quot;hvc1&quot;" />
          <source src={heroVideo} type="video/webm" />
        </video>
      </div>
    </div>
  )
}
