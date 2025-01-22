import { FC, Fragment } from "react"

import { TeamMemberCard } from "../TeamMemberCard"
import denPhoto from './assets/den.png'
import pavelPhoto from './assets/pavel.png'
import classes from './Team.module.scss'

const teamMembers = [
  {
    photoUrl: pavelPhoto,
    name: ['Pavel Emdin', 'Captain'],
    role: 'CEO',
    description: 'Serial entrepreneur, 20+ years in software engineering, 7 yrs in building and growing crypto companies',
    linkedinUrl: 'https://www.linkedin.com/in/emdin/',
  },
  {
    photoUrl: '',
    name: ['***** ********', 'Navigator and Boatswain'],
    role: 'CTO / VP R&D',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: denPhoto,
    name: ['Denis Mashkevich', 'Superkargo'],
    role: 'Chief of Strategy, Devops',
    description: 'Founder and engineer with 25+ years in software development, 18+ years leading teams, ex teamlead @ Kaspa/DAGlabs Linkedin',
    linkedinUrl: '',
  },
  {
    photoUrl: '',
    name: ['Roman Melnikov', 'Passenger with a Map'],
    role: 'Advisor',
    description: 'Chief architect @ Kaspa/DAGlabs, chief architect for Kaspa smart contract integration; Crypto/ZKP software architect',
    linkedinUrl: '',
  },
  {
    photoUrl: '',
    name: ['Mike Zak', 'Sailor'],
    role: 'Software engineer',
    description: 'Seasoned software developer and an OG Kasper - led development of Kaspa up to the release of mainnet, ex core teamlead at DAGlabs',
    linkedinUrl: '',
  },
  {
    photoUrl: '',
    name: ['Ilya Arosov', 'Sailor'],
    role: 'Software engineer',
    description: 'Ex-Intel, embedded, C++',
    linkedinUrl: '',
  },
  {
    photoUrl: '',
    name: ['**** ********', 'Sailor'],
    role: 'Software engineer',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: '',
    name: ['****** *****', 'Sailor'],
    role: 'Software engineer',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
]

export const Team: FC = () => {
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Team</h1>
      <div className={classes.content}>
        {teamMembers.map((member, index) => (
          <Fragment key={index}>
            <TeamMemberCard
              photoUrl={member.photoUrl}
              name={member.name}
              role={member.role}
              description={member.description}
              linkedinUrl={member.linkedinUrl}
            />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
