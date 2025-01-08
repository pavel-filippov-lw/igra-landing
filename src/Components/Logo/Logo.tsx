import { FC } from "react"

import logo from './assets/logo.png'

export const Logo: FC = () => {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 65,
        height: 48,
        background: `center / contain no-repeat url(${logo})`,
      }}
    />
  )
}
