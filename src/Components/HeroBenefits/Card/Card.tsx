import clsx from "clsx"
import { forwardRef, ReactNode } from "react"
import { useNavigate } from "react-router-dom"

import { AnimatedIconVariant, Flex, FlexProps, Icon } from "~/shared/ui"

import classes from './Card.module.scss'

export interface Benefit {
  iconName: AnimatedIconVariant
  title: () => ReactNode
  description?: () => ReactNode
  to: string
}

export interface CardProps extends Benefit, FlexProps {
  className?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  iconName,
  title,
  to,
  className,
  ...props
}, ref) => {
  const navigate = useNavigate()

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
        name={iconName}
        size={120}
      />
      <Flex
        flexDirection='column'
        gap={10}
        className={classes.content}
      >
        <div className={classes.title}>
          {title()}
        </div>
        <div
          className={classes.link}
          onClick={() => {
            document.getElementById('root')?.scrollTo({
              top: 0,
              behavior: 'instant',
            })
            navigate(to)
          }}
        >
          Read more
        </div>
      </Flex>
    </Flex>
  )
})
