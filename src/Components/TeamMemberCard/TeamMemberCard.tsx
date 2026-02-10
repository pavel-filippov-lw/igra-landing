import clsx from "clsx"
import { FC, Fragment } from "react"

import { Flex, Icon } from "~/shared/ui"

import classes from './TeamMemberCard.module.scss'

export interface TeamMemberCardProps {
  photoUrl: string
  name: string[]
  role: string
  description: string
  linkedinUrl: string
  className?: string
}

export const TeamMemberCard: FC<TeamMemberCardProps> = ({
  photoUrl,
  name,
  role,
  description,
  linkedinUrl,
  className,
}) => {
  return (
    <Flex
      gap={17}
      className={clsx(classes.root, className, {
        [classes.isClickable]: !!linkedinUrl,
      })}
    >
      <div
        className={classes.photo}
        style={{ background: `center / contain no-repeat url(${photoUrl})` }}
      />
      <Flex flexDirection='column' gap={14}>
        <div className={classes.name}>
          {name.map((text, index) => (
            <Fragment key={index}>
              <span>{text}</span>
              {index !== name.length - 1 && (
                <br />
              )}
            </Fragment>
          ))}
        </div>
        <div className={classes.description}>
          <div className={classes.role}>{role}</div>
          {`${description}`}
        </div>
        {!!linkedinUrl && (
          <div
            className={classes.link}
          >
            <Icon name='linkedin' size={30} />
          </div>
        )}
      </Flex>
    </Flex>
  )
}
