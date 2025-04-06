import { FC, Fragment } from "react"

import candy from './assets/candy.png'
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
  },
  {
    logoUrl: kaspa,
    name: 'Kaspa.com',
    to: 'https://kaspa.com',
  },
  {
    logoUrl: zealous,
    name: 'Zealous Swap',
  },
  {
    logoUrl: nacho,
    name: 'Nacho the Kat',
  },
  {
    logoUrl: crestdev,
    name: 'Crest Development Studio',
  },
  {
    logoUrl: kastle,
    name: 'Kastle',
  },
  {
    logoUrl: kasunder,
    name: 'Kasunder',
  },
  {
    logoUrl: sea,
    name: 'Sea Swap',
  },
  {
    logoUrl: kasplore,
    name: 'Kasplore',
  },
  {
    logoUrl: candy,
    name: 'Candy Swap',
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
