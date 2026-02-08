import Lottie from "lottie-react"
import { FC, useMemo } from "react"

import blocksAnimationData from './assets/blocksAnimation.json'
import clockAnimationData from './assets/clockAnimation.json'
import flagAnimationData from './assets/flagAnimation.json'
import lockAnimationData from './assets/lockAnimation.json'
import moleculeAnimationData from './assets/moleculeAnimation.json'
import stackAnimationData from './assets/stackAnimation.json'

export type AnimatedIconVariant = 'stack' | 'clock' | 'molecule' | 'blocks' | 'lock'

export interface AnimatedIconProps {
  variant: AnimatedIconVariant
  size: number | string
}

export const AnimatedIcon: FC<AnimatedIconProps> = ({ size, variant }) => {
  const animationData = useMemo(() => {
    return {
      stack: stackAnimationData,
      clock: clockAnimationData,
      molecule: moleculeAnimationData,
      blocks: blocksAnimationData,
      lock: lockAnimationData,
      flag: flagAnimationData,
    }[variant]
  }, [variant])

  return (
    <Lottie
      autoplay
      loop={false}
      animationData={animationData}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    />
  )
}
