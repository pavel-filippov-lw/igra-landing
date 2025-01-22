import { FC, Fragment } from "react"

import { Flex, Icon } from "~/shared/ui"

import classes from './TeamMemberCard.module.scss'

export interface TeamMemberCardProps {
  photoUrl: string
  name: string[]
  role: string
  description: string
  linkedinUrl: string
}

export const TeamMemberCard: FC<TeamMemberCardProps> = ({ photoUrl, name, role, description, linkedinUrl }) => {
  return (
    <Flex
      flexDirection='column'
      gap={20}
      className={classes.root}
    >
      <Flex
        alignItems='center'
        gap={10}
        className={classes.header}
      >
        <div
          className={classes.photo}
          style={{ background: `center / contain no-repeat url(${photoUrl})` }}
        />
        <div className={classes.name}>
          {name.map((text, index) => (
            <Fragment key={index}>
              {text}
              {index !== name.length - 1 && (
                <br />
              )}
            </Fragment>
          ))}
        </div>
      </Flex>
      <div className={classes.description}>
        <span className={classes.role}>{role}</span>
        {` / ${description}`}
      </div>
      <a
        className={classes.link}
        href={linkedinUrl}
        target='_blank'
      >
        <Icon name='linkedin' size={29} />
      </a>
    </Flex>
  )
}
