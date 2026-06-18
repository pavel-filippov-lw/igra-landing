import { FC } from "react"

import { PageLayout } from "~/Components"

import multitudeImage from './assets/multitude.png'
import iconQuantum from './assets/icon-quantum.png'
import iconKyc from './assets/icon-kyc.png'
import iconClob from './assets/icon-clob.png'
import iconPrivate from './assets/icon-private.png'
import classes from './MultitudePage.module.scss'

const features = [
  'Teams run custom EVM on Kaspa’s decentralized sequencer',
  'Every zone has own execution flavor, gas and fee rules, attested by IGRA stake',
  'Zones isolated, blast radius is limited',
  'Optional composability between zones',
]

const useCases = [
  { icon: iconQuantum, label: 'Quantum secure treasury' },
  { icon: iconKyc, label: 'KYC regulated zone' },
  { icon: iconClob, label: 'Low-latency gasless CLOB' },
  { icon: iconPrivate, label: 'Private and auditable zone' },
]

export const MultitudePage: FC = () => {
  return (
    <PageLayout hideBg>
      <div className={classes.root}>
        <div className={classes.hero}>
          <div className={classes.heroContent}>
            <h1 className={classes.title}>MULTITUDE</h1>
          </div>
          <div className={classes.imageWrapper}>
            <img src={multitudeImage} alt="Multitude" className={classes.image} />
          </div>
        </div>

        <div className={classes.details}>
          <div className={classes.description}>
            <h2 className={classes.subtitle}>
              Igra Multitude: composable zones with custom isolated execution
            </h2>
            <ul className={classes.featureList}>
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className={classes.useCases}>
            <h3 className={classes.useCasesTitle}>USE CASES</h3>
            {useCases.map((uc, i) => (
              <div key={i} className={classes.useCase}>
                <img src={uc.icon} alt={uc.label} className={classes.useCaseIcon} />
                <span className={classes.useCaseLabel}>{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
