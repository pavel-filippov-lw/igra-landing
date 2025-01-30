import axios from "axios"
import { FC, useEffect } from "react"
import useSWR from "swr"

const LS_KEY = 'difficulty'
const DEFAULT_DIFFICULTY = 1.45e+18

const formatDifficulty = (value: number): number => +(value / 1e18).toFixed(2)

const fetcher = (url: string) => axios.get(url).then(({ data }) => data[0].difficulty)

const getStoredDifficulty = (): number => {
  const stored = localStorage.getItem(LS_KEY)

  return stored ? parseFloat(stored) : DEFAULT_DIFFICULTY
}

export const DifficultyLabel: FC = () => {
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
    <>
      Secured by the
      {` ${formatDifficulty(data)} `}
      EH/s hash power
    </>
  )
}
