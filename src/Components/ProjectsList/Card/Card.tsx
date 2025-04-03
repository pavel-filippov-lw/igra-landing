import { FC } from "react"

import { Flex } from "~/shared/ui"

import classes from './Card.module.scss'

export interface Project {
  logoUrl: string
  name: string
}

export interface CardProps extends Project {}

export const Card: FC<CardProps> = ({ logoUrl, name, ...props }) => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      gap={8}
      {...props}
      className={classes.root}
    >
      <div
        className={classes.logo}
        style={{ background: `center / contain no-repeat url(${logoUrl})` }}
      />
      <div className={classes.name}>
        {name}
      </div>
    </Flex>
  )
}
