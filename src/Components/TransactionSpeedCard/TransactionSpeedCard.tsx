import clsx from "clsx"
import { forwardRef } from "react"
import { Pie, PieChart } from "recharts"

import classes from './TransactionSpeedCard.module.scss'

export interface TransactionSpeedCardProps {
  value: number // %
  isLoading?: boolean
  className?: string
}

export const TransactionSpeedCard = forwardRef<HTMLDivElement, TransactionSpeedCardProps>(({ value, isLoading, className }, ref) => {
  return (
    <div ref={ref} className={clsx(classes.root, className)}>
      <div className={classes.chart}>
        <PieChart responsive className={classes.chartPieChart}>
          <defs>
            <linearGradient
              id="transactionSpeedGradient"
              x1="0"
              y1="1"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#4BABAB" />
              <stop offset="100%" stopColor="#EFFC66" />
            </linearGradient>
          </defs>
          <Pie
            cx='50%'
            cy='100%'
            innerRadius='80%'
            outerRadius='100%'
            fill='#FFFFFF'
            startAngle={180}
            endAngle={0}
            animationBegin={0}
            animationDuration={0}
            dataKey='value'
            className={classes.chartPieSector}
            data={[{
              value: 100,
              stroke: 'none',
            }]}
          />
          <Pie
            cx='50%'
            cy='100%'
            innerRadius='80%'
            outerRadius='100%'
            fill='#FFFFFF'
            startAngle={180}
            endAngle={0}
            animationBegin={0}
            dataKey='value'
            className={classes.chartPieSector}
            data={[{
              value: isLoading ? 0 : value,
              fill: 'url(#transactionSpeedGradient)',
              stroke: 'none',
            }, {
              value: 100 - value <= 0 ? 0 : 100 - value,
              stroke: 'none',
            }]}
          />
        </PieChart>
        <div className={classes.labels}>
          <div className={classes.label}>
            0.0
          </div>
          <div className={classes.label}>
            1.0
          </div>
        </div>
        <div className={classes.text}>
          Transaction Speed
        </div>
      </div>
    </div>
  )
})
