import React, { CSSProperties } from 'react'

import { IconName, icons } from './assets'

export interface IconProps {
  name: IconName
  size?: number | string
  width?: number
  height?: number
  className?: string
  style?: Omit<CSSProperties, 'width' | 'height' | 'minHeight' | 'minWidth'>
}

export const Icon: React.FC<IconProps> = ({ name, className, size, width, height, style }) => {
  const { Component } = icons[name]

  return (
    <Component
      className={className}
      style={{
        width: width || size,
        height: height || size,
        minHeight: height || size,
        minWidth: width || size,
        ...style,
      }}
    />
  )
}
