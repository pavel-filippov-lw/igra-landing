import clsx from "clsx"
import { forwardRef, ReactNode } from "react"

import { Flex, FlexProps, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './Card.module.scss'

export interface Benefit {
  icon: {
    name: IconName
    width: number
    height: number
  }
  title: () => ReactNode
  to?: string
}

export interface CardProps extends Benefit, FlexProps {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  to,
  className,
  ...props
}, ref) => {
  return (
    <Flex
      ref={ref}
      flexDirection='column'
      alignItems='center'
      gap={20}
      {...props}
      className={clsx(classes.root, className)}
    >
      <Icon
        name={icon.name}
        width={icon.width}
        height={icon.height}
        className={classes.icon}
      />
      <Flex
        flexDirection='column'
        gap={10}
        className={classes.content}
      >
        <div className={classes.title}>
          {title()}
        </div>
        {!!to && (
          <a
            href={to}
            target='_blank'
            rel='noreferrer'
            className={classes.link}
          >
            Read more
          </a>
        )}
      </Flex>
    </Flex>
  )
})
