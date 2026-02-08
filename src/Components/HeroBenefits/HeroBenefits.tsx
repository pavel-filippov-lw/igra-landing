import gsap from "gsap"
import { FC, Fragment, useEffect, useRef } from "react"

import { to } from "~/shared/lib"

import { Benefit, Card } from "./Card"
import classes from './HeroBenefits.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'stack',
    title: () => (
      <>
        <span className={classes.boldTitle}>Protected</span>
        <br />
        {' by Bitcoin-grade security'}
      </>
    ),
    to: to.benefits('0'),
  },
  {
    iconName: 'clock',
    title: () => (
      <>
        <span className={classes.boldTitle}>MEV</span>
        <br />
        {' and censorship resistant'}
      </>
    ),
    to: to.benefits('1'),
  },
  {
    iconName: 'molecule',
    title: () => (
      <>
        <span className={classes.boldTitle}>Post Quantum</span>
        <br />
        {' Cryptography resilient'}
      </>
    ),
    to: to.benefits('2'),
  },
  {
    iconName: 'blocks',
    title: () => (
      <>
        {'Independent logical '}
        <span className={classes.boldTitle}>zones</span>
      </>
    ),
    to: to.benefits('3'),
  },
  {
    iconName: 'lock',
    title: () => (
      <span className={classes.boldTitle}>Secure Privacy</span>
    ),
    to: to.benefits('4'),
  },
  {
    iconName: 'flag',
    title: () => (
      <>
        <span className={classes.boldTitle}>Swiss</span>
        <br />
        {' registered company'}
      </>
    ),
    to: to.benefits('5'),
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
