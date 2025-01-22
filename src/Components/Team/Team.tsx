import { FC, Fragment } from "react"

import { TeamMemberCard } from "../TeamMemberCard"
import denPhoto from './assets/den.png'
import pavelPhoto from './assets/pavel.png'
import romanPhoto from './assets/rom.png'
import mikePhoto from './assets/mike.png'
import ilyaPhoto from './assets/ilya.png'
import anonPhoto from './assets/anon.png'

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
    photoUrl: anonPhoto,
    name: ['***** ********', 'Navigator and Boatswain'],
    role: 'CTO, VP R&D',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: denPhoto,
    name: ['Denis Mashkevich', 'Supercargo and Cabin Boy'],
    role: 'IT, Devops',
    description: 'Founder and engineer with 25 years in software development, 18 years leading teams, ex teamlead @ DAGlabs',
    linkedinUrl: 'https://www.linkedin.com/in/denis-mashkevich-78b6aa/',
  },
  {
    photoUrl: mikePhoto,
    name: ['Mike Zak', 'Sailor'],
    role: 'Software engineer',
    description: 'Software developer, an OG Kasper, led development of Kaspa up to the release of mainnet, ex core teamlead @ DAGlabs',
    linkedinUrl: 'https://www.linkedin.com/in/mike-zak-2721324b/',
  },
  {
    photoUrl: ilyaPhoto,
    name: ['Ilya Arosov', 'Sailor'],
    role: 'Software engineer',
    description: 'Ex-Intel, embedded systems',
    linkedinUrl: 'https://www.linkedin.com/in/arosov/',
  },
  {
    photoUrl: anonPhoto,
    name: ['**** ********', 'Sailor'],
    role: 'Software engineer',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: anonPhoto,
    name: ['****** *****', 'Sailor'],
    role: 'Software engineer',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: romanPhoto,
    name: ['Roman Melnikov', 'Passenger with a Map'],
    role: 'Advisor',
    description: 'Chief Architect @ Kaspa/DAGlabs, Chief Architect for Kaspa smart contract integration; Crypto/ZKP software architect',
    linkedinUrl: 'https://www.linkedin.com/in/romanmelnikov/',
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
