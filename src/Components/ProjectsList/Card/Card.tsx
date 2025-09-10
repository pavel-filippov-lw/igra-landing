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
  const hiddenRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [minHeight, setMinHeight] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(() => {
      setHeight(ref.current?.scrollHeight || 0)
    })
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref.current])

  useEffect(() => {
    if (!hiddenRef.current) return

    const hiddenObserver = new ResizeObserver(() => {
      setMinHeight(hiddenRef.current?.scrollHeight || 0)
    })
    hiddenObserver.observe(hiddenRef.current)

    return () => hiddenObserver.disconnect()
  }, [hiddenRef.current])

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
        className={classes.description}
        style={{
          maxHeight: expanded ? `${height}px` : `${minHeight}px`,
        }}
      >
        {expanded ? description : `${description.slice(0, 130)}...`}
      </div>
      <div ref={hiddenRef} className={classes.hiddenDescription}>
        {description.slice(0, 130)}
      </div>
      <div ref={ref} className={classes.hiddenDescription}>
        {description}
      </div>
      {description.length > 130 && (
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
