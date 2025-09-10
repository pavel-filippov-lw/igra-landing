import { FC, Fragment } from "react"

import crestdev from './assets/crestdev.png'
import kaspa from './assets/kaspa.png'
import kasplore from './assets/kasplore.png'
import kastle from './assets/kastle.png'
import kasunder from './assets/kasunder.png'
import kspr from './assets/kspr.png'
import nacho from './assets/nacho.png'
import sea from './assets/sea.png'
import zealous from './assets/zealous.png'
import { Card, Project } from "./Card"
import classes from './ProjectsList.module.scss'

const projects: Project[] = [
  {
    logoUrl: kspr,
    name: 'KSPR',
    description: 'KSPR is a Bitcoin prediction market where you forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for.. KSPR is a Bitcoin prediction market where you forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for.. KSPR is a Bitcoin prediction market where you forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://kspr-bot.xyz/',
    type: 'Application',
  },
  {
    logoUrl: kaspa,
    name: 'Kaspa.com',
    description: 'Kaspa.com is a market where you forecast a price range instead of answering  Yes or No. It runs on our custom CLMSRYes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://kaspa.com',
    type: 'Wallet',
  },
  {
    logoUrl: zealous,
    name: 'Zealous Swap',
    description: 'Zealous Swap is your forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://www.zealousswap.com/',
    type: 'Application',
  },
  {
    logoUrl: nacho,
    name: '*Nacho the Kat*',
    description: 'Nacho the Kat is a Bitcoin prediction market where you range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://www.nachowyborski.xyz/',
    type: 'Application',
  },
  {
    logoUrl: crestdev,
    name: '*Crest Development*',
    description: 'Crest Development Studio where you forecast a price range instead. It runs on our custom CLMSR model, built for..',
    to: 'http://crestdev.pro/',
    type: 'Application',
  },
  {
    logoUrl: kastle,
    name: '*Kastle*',
    description: 'Kastle is your forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://kastle.cc/',
    type: 'Application',
  },
  {
    logoUrl: kasunder,
    name: '*Kasunder*',
    description: 'Kasunder is a Bitcoin prediction market where you forecast a price range instead of Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://kasunder.com',
    type: 'Application',
  },
  {
    logoUrl: sea,
    name: '*Sea Swap*',
    description: 'Sea Swap is a Bitcoin prediction market where you forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://x.com/SeaSwapIO',
    type: 'Application',
  },
  {
    logoUrl: kasplore,
    name: '*Kasplore*',
    description: 'Kasplore Swap is your forecast a price range instead of answering Yes or No. It runs on our custom CLMSR model, built for..',
    to: 'https://kasplore.com',
    type: 'Application',
  },
]

export const ProjectsList: FC = () => {
  return (
    <div className={classes.root}>
      {projects.map((project, index) => (
        <Fragment key={index}>
          <a href={project.to} target='_blank' rel='noreferrer'>
            <Card {...project} />
          </a>
        </Fragment>
      ))}
    </div>
  )
}
