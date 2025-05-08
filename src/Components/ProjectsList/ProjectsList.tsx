import { FC, Fragment } from "react"

import candy from './assets/candyswap.png'
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
    to: 'https://kspr-bot.xyz/'
  },
  {
    logoUrl: kaspa,
    name: 'Kaspa.com',
    to: 'https://kaspa.com',
  },
  {
    logoUrl: zealous,
    name: 'Zealous Swap',
    to: 'https://www.zealousswap.com/'
  },
  {
    logoUrl: nacho,
    name: 'Nacho the Kat',
    to: 'https://www.nachowyborski.xyz/'
  },
  {
    logoUrl: crestdev,
    name: 'Crest Development',
    to: 'http://crestdev.pro/'
  },
  {
    logoUrl: kastle,
    name: 'Kastle',
    to: 'https://kastle.cc/'
  },
  {
    logoUrl: kasunder,
    name: 'Kasunder',
    to: 'https://kasunder.com'
  },
  {
    logoUrl: sea,
    name: 'Sea Swap',
    to: 'https://x.com/SeaSwapIO'
  },
  {
    logoUrl: kasplore,
    name: 'Kasplore',
    to: 'https://kasplore.com'
  },
  {
    logoUrl: candy,
    name: 'Candy Swap',
    to: 'https://candyswap.gg/'
  },
]

export const ProjectsList: FC = () => {
  return (
    <div className={classes.root}>
      {projects.map((project, index) => (
        <Fragment key={index}>
          <a href={project.to}>
            <Card {...project} />
          </a>
        </Fragment>
      ))}
    </div>
  )
}
