import gsap from "gsap"
import { FC, Fragment, useEffect, useRef } from "react"

import { Benefit, Card } from "./Card"
import classes from './HeroBenefits.module.scss'

const benefitsList: Benefit[] = [
  {
    icon: {
      name: 'heroBenefitIcon_1',
      width: 123,
      height: 176,
    },
    title: () => (
      <>
        <span className={classes.boldTitle}>Protected</span>
        <br />
        {' by Bitcoin-grade security'}
      </>
    ),
    to: 'example',
  },
  {
    icon: {
      name: 'heroBenefitIcon_2',
      width: 125,
      height: 125,
    },
    title: () => (
      <>
        <span className={classes.boldTitle}>MEV</span>
        <br />
        {' and censorship resistant'}
      </>
    ),
  },
  {
    icon: {
      name: 'heroBenefitIcon_3',
      width: 119,
      height: 75,
    },
    title: () => (
      <>
        <span className={classes.boldTitle}>Post Quantum</span>
        <br />
        {' Cryptography resilient'}
      </>
    ),
  },
  {
    icon: {
      name: 'heroBenefitIcon_4',
      width: 88,
      height: 91,
    },
    title: () => (
      <>
        <span className={classes.boldTitle}>Independent</span>
        {' logical zones'}
      </>
    ),
  },
  {
    icon: {
      name: 'heroBenefitIcon_5',
      width: 93,
      height: 115,
    },
    title: () => (
      <>
        {'Secure '}
        <span className={classes.boldTitle}>Privacy</span>
      </>
    ),
  },
  {
    icon: {
      name: 'heroBenefitIcon_6',
      width: 106,
      height: 118,
    },
    title: () => (
      <>
        <span className={classes.boldTitle}>Swiss</span>
        {' registered company'}
      </>
    ),
  },
]

export const HeroBenefits: FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 1 + index * 0.5,
          ease: 'power3.out',
        })
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    cardRefs.current.forEach(card => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={classes.root}>
      {benefitsList.map((benefit, index) => (
        <Fragment key={index}>
          <Card
            ref={(el) => cardRefs.current.push(el)}
            {...benefit}
            className={classes.card}
          />
        </Fragment>
      ))}
    </div>
  )
}
