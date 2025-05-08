import axios from "axios"
import { FC, useEffect } from "react"
import useSWR from "swr"

import classes from './Difficulty.module.scss'

const LS_KEY = 'difficulty'
const DEFAULT_DIFFICULTY = 1.45e+18

const formatDifficulty = (value: number): number => {
  const difficulty = value / 1e18

  return +(difficulty >= 1 ? difficulty : 1).toFixed(2)
}

const fetcher = (url: string) => axios.get(url).then(({ data }) => data[0].difficulty)

const getStoredDifficulty = (): number => {
  const stored = localStorage.getItem(LS_KEY)

  return stored ? 0.98 : DEFAULT_DIFFICULTY
}

export const Difficulty: FC = () => {
  const { data } = useSWR(
    'https://api.minerstat.com/v2/coins?list=KAS',
    fetcher,
    {
      refreshInterval: 60000,
      fallbackData: getStoredDifficulty(),
    },
  )

  useEffect(() => {
    if (data) {
      localStorage.setItem(LS_KEY, data.toString())
    }
  }, [data])

  return (
    <div className={classes.root}>
      Secured by the
      <span className={classes.value}>
        {` ${formatDifficulty(data)} `}
      </span>
      EH hash power
    </div>
  )
}
