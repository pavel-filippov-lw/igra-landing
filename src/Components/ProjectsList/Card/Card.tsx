import clsx from "clsx"
import { FC } from "react"

import { Flex, FlexProps } from "~/shared/ui"

import classes from './Card.module.scss'

export interface Project {
  logoUrl: string
  name: string
  to?: string
}

export interface CardProps extends Project, FlexProps {}

export const Card: FC<CardProps> = ({ logoUrl, name, to, ...props }) => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      gap={8}
      {...props}
      className={clsx(classes.root, {
        [classes.isClickable]: !!to,
      })}
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
