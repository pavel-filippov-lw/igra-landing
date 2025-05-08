import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import { TeamMemberCard } from "../TeamMemberCard"
import denPhoto from './assets/den.png'
import deuelPhoto from './assets/deuel.png'
import ilyaPhoto from './assets/ilya.png'
import mikePhoto from './assets/mike.png'
import pavelPhoto from './assets/pavel.png'
import romanPhoto from './assets/rom.png'
import igorPhoto from './assets/new1.png'
import behzadPhoto from './assets/new2.png'
import vadimPhoto from './assets/new3.png'

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
    photoUrl: vadimPhoto,
    name: ['Vadim Konstantinov', 'Navigator and Boatswain'],
    role: 'CTO, VP R&D',
    description: 'ex chief architect @ Panther protocol, experienced engineering leader and blockchain architect ',
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
    photoUrl: igorPhoto,
    name: ['Igor Markelov', 'Bowman'],
    role: 'Head of Engineering',
    description: 'Ph.D. in Computational Sciences, ex Architect/Tech Lead @ Panther Protocol, DevCon speaker, ETHGlobal hackathon winner',
    linkedinUrl: '',
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
    photoUrl: behzadPhoto,
    name: ['Behzad Pournouri', 'Sailor'],
    role: 'Software engineer',
    description: 'Hyperledger Fabric, Solidity, Rust, Cairo, JavaScript',
    linkedinUrl: 'https://www.linkedin.com/in/bitnician/',
  },
  {
    photoUrl: romanPhoto,
    name: ['Roman Melnikov', 'Passenger with a Map'],
    role: 'Advisor',
    description: 'Chief Architect @ Kaspa/DAGlabs, Chief Architect for Kaspa smart contract integration; Crypto/ZKP software architect',
    linkedinUrl: 'https://www.linkedin.com/in/romanmelnikov/',
  },
  {
    photoUrl: deuelPhoto,
    name: ['Deuel Horowitz', 'Jurisconsultus'],
    role: 'Legal counsel',
    description: 'International lawyer and litigator ; ex-MOJ ; emerging technologies regulation',
    linkedinUrl: 'https://www.linkedin.com/in/deuel-horowitz-41840b20a/',
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
