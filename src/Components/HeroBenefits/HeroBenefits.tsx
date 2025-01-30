import clsx from "clsx"
import { FC, ReactNode } from "react"

import { Flex, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import { DifficultyLabel } from "./DifficultyLabel"
import classes from './HeroBenefits.module.scss'

const benefitsList = [
  { iconName: 'cube_1', label: 'Based ZK rollup with atomic composability' },
  { iconName: 'cube_2', label: 'Insanely fast and secure Kaspa DAG as a decentralized sequencer' },
  { iconName: 'cube_3', label: <DifficultyLabel /> },
  { iconName: 'cube_4', label: 'EVM-compatible, enabling seamless use of existing Ethereum tools' },
] as { iconName: IconName, label: ReactNode }[]

export interface HeroBenefitsProps {
  className?: string
}

export const HeroBenefits: FC<HeroBenefitsProps> = ({ className }) => {
  return (
    <Flex
      flexDirection='column'
      gap={21}
      className={clsx(classes.root, className)}
    >
      {benefitsList.map((benefit, index) => (
        <Flex
          key={index}
          gap={16}
          alignItems='center'
        >
          <Icon name={benefit.iconName} size={26} />
          <div className={classes.label}>{benefit.label}</div>
        </Flex>
      ))}
    </Flex>
  )
}
