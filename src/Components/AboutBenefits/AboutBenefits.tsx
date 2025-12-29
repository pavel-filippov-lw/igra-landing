import gsap from "gsap"
import { FC, Fragment, useEffect, useRef } from "react"

import { Benefit, Card } from "../HeroBenefits/Card"
import classes from './AboutBenefits.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'mark',
    title: () => (
      <>
        <span className={classes.boldTitle}>ATTesting</span>
        <br />
        Attesters ensure Igra-to-Kaspa state consistency and receive protocol-level incentives and fee participation.
      </>
    ),
    to: '',
  },
  {
    iconName: 'governance',
    title: () => (
      <>
        <span className={classes.boldTitle}>Governance</span>
        <br />
        {'IGRA governs Igra\'s security-critical parameters via Igra DAO, including attestation rules, rewards and penalties calibration, bridge configuration and updates, and allocation of ecosystem grants.'}
      </>
    ),
    to: '',
  },
  {
    iconName: 'flag',
    title: () => (
      <>
        <span className={classes.boldTitle}>Swiss Compliance</span>
        <br />
        Igra Association and the IGRA utility token are registered in Switzerland, Zug. MiCA paper submitted, ensuring clear legal responsibility and transparent management of funds.
      </>
    ),
    to: '',
  },
  {
    iconName: 'rocket',
    title: () => (
      <>
        <span className={classes.boldTitle}>Future Utility</span>
        <br />
        IGRA extends to securing bridges, additional execution environments including ZK, and preferential access to network services.
      </>
    ),
    to: '',
  },
]

export const AboutBenefits: FC = () => {
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
