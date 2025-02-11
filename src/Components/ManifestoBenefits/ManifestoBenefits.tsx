import { FC, Fragment } from "react"

import { Flex, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './ManifestoBenefits.module.scss'

const benefitsList = [
  {
    iconName: 'cube_1',
    title: 'Maximal Decentralization',
    label: ['Every system we design must protect the autonomy of its participants. From consensus to governance, power is distributed among the community rather than consolidated in the hands of a few.'],
  },
  {
    iconName: 'cube_2',
    title: 'Open-Source, Permissionless Innovation',
    label: ['We are committed to fostering an ecosystem where anyone can build, improve, or challenge our work. By embracing a culture of open development, we unlock collective creativity and create unstoppable tools for financial freedom.'],
  },
  {
    iconName: 'cube_3',
    title: 'Sovereignty Over Convenience',
    label: ['While ease of use is important, we prioritize user sovereignty above all. We reject any trade-offs that compromise self-custody, immutable code, or personal control.'],
  },
  {
    iconName: 'cube_5',
    title: 'Global Interoperability',
    label: ['Igra bridges blockchains, VMs, and ecosystems to form a globally connected network of applications and assets. Our ultimate goal is an internet of value—an inclusive digital economy accessible to everyone, anywhere.'],
  },
  {
    iconName: 'cube_4',
    title: 'Resilience and Longevity',
    label: [
      'By embedding crypto-maximalist ideals into our protocols—robust cryptography, verifiable execution, and zero-knowledge proofs—we ensure the durability of our technology far beyond the lifespan of any single company or governing body.',
      'Our mission is to empower individuals with tools that uphold the purest ideals of crypto: decentralization, security, and freedom. By aligning with these core tenets, Igra intends to lead the charge in creating a trustless, borderless, and self-sovereign world.',
    ],
  },
] as { iconName: IconName, title: string, label: string[] }[]

export const ManifestoBenefits: FC = () => {
  return (
    <Flex
      flexDirection='column'
      gap={21}
      className={classes.root}
    >
      {benefitsList.map((benefit, index) => (
        <Flex
          key={index}
          className={classes.benefit}
        >
          <Icon name={benefit.iconName} size={33} />
          <div className={classes.label}>
            <div className={classes.title}>{benefit.title}</div>
            {benefit.label.map((part, index) => (
              <Fragment key={index}>
                <div>{part}</div>
                {index !== benefit.label.length - 1 && <br />}
              </Fragment>
            ))}
          </div>
        </Flex>
      ))}
    </Flex>
  )
}
