import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import { TeamMemberCard } from "../TeamMemberCard"
import boatswainPhoto from './assets/boatswain.png'
import denPhoto from './assets/den.png'
import ilyaPhoto from './assets/ilya.png'
import mikePhoto from './assets/mike.png'
import pavelPhoto from './assets/pavel.png'
import romanPhoto from './assets/rom.png'
import sailorPhoto from './assets/sailor.png'
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
    photoUrl: boatswainPhoto,
    name: ['***** ********', 'Navigator and Boatswain'],
    role: 'CTO, VP R&D',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: denPhoto,
    name: ['Denis Mashkevich', 'Supercargo and Cabin Boy'],
    role: 'Chief of Strategy, IT/Devops',
    description: 'Founder and engineer with 25 years in software development, 18 years leading teams, ex teamlead @ DAGlabs',
    linkedinUrl: 'https://www.linkedin.com/in/denis-mashkevich-78b6aa/',
  },
  {
    photoUrl: mikePhoto,
    name: ['Mike Zak', 'Sailor'],
    role: 'Blockchain Developer',
    description: 'Software developer, an OG Kasper, led development of Kaspa up to the release of mainnet, ex core teamlead @ DAGlabs',
    linkedinUrl: 'https://www.linkedin.com/in/mike-zak-2721324b/',
  },
  {
    photoUrl: ilyaPhoto,
    name: ['Ilya Arosov', 'Sailor'],
    role: 'Blockchain Developer',
    description: 'Ex-Intel, embedded systems, Rust, C++',
    linkedinUrl: 'https://www.linkedin.com/in/arosov/',
  },
  {
    photoUrl: sailorPhoto,
    name: ['**** ********', 'Sailor'],
    role: 'Software engineer',
    description: 'To be disclosed',
    linkedinUrl: '',
  },
  {
    photoUrl: sailorPhoto,
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
      <Flex flexWrap='wrap' className={classes.content}>
        {teamMembers.map((member, index) => (
          <Fragment key={index}>
            <TeamMemberCard
              className={classes.card}
              photoUrl={member.photoUrl}
              name={member.name}
              role={member.role}
              description={member.description}
              linkedinUrl={member.linkedinUrl}
            />
          </Fragment>
        ))}
      </Flex>
      <div className={classes.shipBg} />
    </div>
  )
}
