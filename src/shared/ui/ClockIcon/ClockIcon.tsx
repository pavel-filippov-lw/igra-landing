import gsap from "gsap"
import { FC, useEffect, useRef } from "react"

import classes from './ClockIcon.module.scss'

export interface ClockIconProps {
  size?: number | string
}

export const ClockIcon: FC<ClockIconProps> = ({ size }) => {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el
  }

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          duration: 1,
          ease: 'power1.inOut',
        })
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    refs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          observer.observe(ref)
        }, index * 500)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={classes.root} style={{ width: size, height: size, minWidth: size, minHeight: size }}>
      <div className={classes.container}>
        <div ref={setRef(0)} className={classes.outer} />
        <div ref={setRef(1)} className={classes.innerContainer}>
          <div className={classes.inner} />
          <div className={classes.oval} />
        </div>
      </div>
    </div>
  )
}
