import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

import { Flex, FlexProps } from "~/shared/ui"

import cubeVideoSafari from './assets/caravel.mov'
import cubeVideo from './assets/caravel.webm'
import classes from './CubeSection.module.scss'

export interface CubeSectionProps extends PropsWithChildren, FlexProps {}

export const CubeSection: FC<CubeSectionProps> = ({ children, className, ...props }) => {
  return (
    <Flex
      {...props}
      className={clsx(classes.root, className)}
    >
      <div className={classes.leftSide}>
        {children}
      </div>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        className={classes.video}
      >
        <source src={cubeVideoSafari} type="video/mp4; codecs=&quot;hvc1&quot;" />
        <source src={cubeVideo} type="video/webm" />
      </video>
    </Flex>
  )
}
