import './global.scss'
import './fonts/fonts.scss'

import { FC } from "react"

import { AppRouter } from './router'

export const App: FC = () => {
  return (
    <AppRouter />
  )
}
