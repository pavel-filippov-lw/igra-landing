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
  title?: string
  description: ReactNode
}
export interface CardProps extends Benefit, FlexProps {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  icon,
  title,
  description,
  className,
  ...props
}, ref) => {
  return (
    <Flex
      ref={ref}
      flexDirection='column'
      alignItems='center'
      gap={15}
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
        gap={5}
        alignItems='center'
      >
        {title && (
          <h5 className={classes.title}>
            {title}
          </h5>
        )}
        <div className={classes.description}>
          {description}
        </div>
      </Flex>
    </Flex>
  )
})
