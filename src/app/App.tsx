import './global.scss'
import './fonts/fonts.scss'
import 'react-loading-skeleton/dist/skeleton.css'

import { FC } from "react"

import { AppRouter } from './router'

export const App: FC = () => {
  return (
    <AppRouter />
  )
}
