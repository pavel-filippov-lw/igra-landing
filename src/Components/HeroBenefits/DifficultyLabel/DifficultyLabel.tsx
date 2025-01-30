import axios from "axios"
import { FC, useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"

const formatDifficulty = (value: number): number => {
  return +(value / 1e18).toFixed(2)
}

export const DifficultyLabel: FC = () => {
  const [difficulty, setDifficulty] = useState<number | undefined>(undefined)

  useEffect(() => {
    axios.get('https://api.minerstat.com/v2/coins?list=KAS')
      .then(({ data }) => setDifficulty(formatDifficulty(data[0].difficulty)))
  }, [])

  return (
    <>
      Secured by the
      {' '}
      {difficulty || <Skeleton inline width={40} />}
      {' '}
      EH/s hash power
    </>
  )
}
