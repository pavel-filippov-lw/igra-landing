import { FC, Fragment, useEffect } from "react"

import { Benefit, Card } from "../HeroBenefits/Card"
import classes from './AboutBenefits.module.scss'

const benefitsList: Benefit[] = [
  {
    iconName: 'mark',
    title: () => <span className={classes.boldTitle}>Attesting</span>,
    description: () => (
      <>
        Attesters ensure Igra-to-Kaspa state consistency and receive protocol-level incentives and fee participation.
      </>
    ),
    to: 'https://igra-labs.gitbook.io/igralabs-docs/for-developers/architecture/specifications/igra-attesting-protocol',
  },
  {
    iconName: 'governance',
    title: () => <span className={classes.boldTitle}>Governance</span>,
    description: () => (
      <>
        {'$IGRA governs attestation, rewards and penalties, bridge configuration, grants.'}
      </>
    ),
    to: 'https://governance.igralabs.com/',
  },
  {
    iconName: 'flag',
    title: () => <span className={classes.boldTitle}>Swiss Compliance</span>,
    description: () => (
      <>
        Igra Association registered in Switzerland, ensuring clear legal responsibility and transparent management of funds.
      </>
    ),
    to: '',
  },
  {
    iconName: 'rocket',
    title: () => <span className={classes.boldTitle}>Future Utility</span>,
    description: () => (
      <>
        $IGRA extends to securing bridges, additional execution environments, and preferential access to network services.
      </>
    ),
    to: '',
  },
]

export const AboutBenefits: FC = () => {
  // Animation removed - cards now appear immediately
  useEffect(() => {
    // Cleanup for any future animations if needed
  }, [])

  return (
    <div className={classes.root}>
      {benefitsList.map((benefit, index) => (
        <Fragment key={index}>
          <Card
            {...benefit}
            className={classes.card}
            showBorder={true}
          />
        </Fragment>
      ))}
    </div>
  )
}
