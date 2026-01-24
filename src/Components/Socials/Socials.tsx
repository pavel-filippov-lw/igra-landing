import { FC } from "react"

import { Flex, Icon } from "~/shared/ui"
import { IconName } from "~/shared/ui/Icon/assets"

import classes from './Socials.module.scss'

const links = [
  // { iconName: 'telegram', to: '' },
  { iconName: 'email', to: 'mailto:team@igralabs.com' },
  { iconName: 'twitter', to: 'https://x.com/Igra_Labs' },
  { iconName: 'discord', to: 'https://discord.gg/igralabs' },
  { iconName: 'github', to: 'https://github.com/IGRALABS' },
] as { iconName: IconName, to: string }[]

export interface SocialsProps {
  className: string
}

export const Socials: FC<SocialsProps> = ({ className }) => {
  return (
    <Flex gap={19} className={className}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.to}
          target={link.iconName === 'email' ? undefined : '_blank'}
          rel={link.iconName === 'email' ? undefined : 'noopener noreferrer'}
        >
          <Icon className={classes.icon} name={link.iconName} size={24} />
        </a>
      ))}
    </Flex>
  )
}
