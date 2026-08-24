import { FC, useEffect, useRef, useState } from 'react'

import classes from './TangemClaimPage.module.scss'

/**
 * Live countdown to a claim deadline, anchored to SERVER time (not the browser
 * clock, which the user can change). We capture the server↔browser skew once from
 * `serverTimeIso` and apply it every tick. Calls `onExpire` when it crosses zero.
 */
export const Countdown: FC<{
  deadlineIso: string
  serverTimeIso: string
  onExpire?: () => void
}> = ({ deadlineIso, serverTimeIso, onExpire }) => {
  const deadline = Date.parse(deadlineIso)
  // Offset between the server clock and this browser, captured once at mount.
  const offsetRef = useRef(Date.parse(serverTimeIso) - Date.now())
  const [remaining, setRemaining] = useState(() => deadline - (Date.now() + offsetRef.current))
  const firedRef = useRef(false)

  useEffect(() => {
    if (isNaN(deadline)) return
    const tick = () => {
      const r = deadline - (Date.now() + offsetRef.current)
      setRemaining(r)
      if (r <= 0 && !firedRef.current) {
        firedRef.current = true
        onExpire?.()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  if (isNaN(deadline)) return null
  if (remaining <= 0) return <span className={classes.countdown}>Claim period closed</span>

  const total = Math.floor(remaining / 1000)
  const days = Math.floor(total / 86_400)
  const hours = Math.floor((total % 86_400) / 3_600)
  const mins = Math.floor((total % 3_600) / 60)
  const secs = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <span className={classes.countdown}>
      {days > 0 ? `${days}d ` : ''}
      {pad(hours)}h {pad(mins)}m {pad(secs)}s
    </span>
  )
}
