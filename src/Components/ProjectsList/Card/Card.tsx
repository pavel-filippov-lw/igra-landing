import clsx from "clsx"
import { FC, useEffect, useRef, useState } from "react"

import { Flex } from "~/shared/ui"

import classes from './Card.module.scss'

export interface Project {
  type: string
  logoUrl: string
  name: string
  description: string
  to?: string
}

export interface CardProps extends Project {}

export const Card: FC<CardProps> = ({ type, logoUrl, name, to, description }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [clamped, setClamped] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => setClamped(el.scrollHeight > el.clientHeight)
    requestAnimationFrame(check)
  }, [ref.current])

  return (
    <Flex
      flexDirection='column'
      gap={10}
      className={clsx(classes.root, {
        [classes.isClickable]: !!to,
      })}
    >
      <Flex justifyContent='space-between' className={classes.header}>
        <div
          className={classes.logo}
          style={{ background: `center / cover no-repeat url(${logoUrl})` }}
        />
        <div className={classes.type}>
          {type}
        </div>
      </Flex>
      <div className={classes.name}>
        {name}
      </div>
      <div
        ref={ref}
        className={classes.description}
        style={{
          lineClamp: expanded ? 'unset' : 3,
          WebkitLineClamp: expanded ? 'unset' : 3,
        }}
      >
        {description}
      </div>
      {clamped && (
        <div
          className={classes.link}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setExpanded(!expanded)
          }}
        >
          {expanded ? 'Less' : 'More'}
        </div>
      )}
    </Flex>
  )
}
