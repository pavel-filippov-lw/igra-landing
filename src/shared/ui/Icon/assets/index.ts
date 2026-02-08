import ArrowRight from './arrowRight.svg?react'
import ArrowTopRight from './arrowTopRight.svg?react'
import Blocks from './blocks.svg?react'
import Caravel from './caravel.svg?react'
import Clock from './clock.svg?react'
import Cube_1 from './cube_1.svg?react'
import Cube_2 from './cube_2.svg?react'
import Cube_3 from './cube_3.svg?react'
import Cube_4 from './cube_4.svg?react'
import Cube_5 from './cube_5.svg?react'
import Cube_6 from './cube_6.svg?react'
import Dex from './dex.svg?react'
import Discord from './discord.svg?react'
import Flag from './flag.svg?react'
import Github from './github.svg?react'
import Gitlab from './gitlab.svg?react'
import Governance from './governance.svg?react'
import InfinityIcon from './infinity.svg?react'
import Lightning from './lightning.svg?react'
import Linkedin from './linkedin.svg?react'
import Lock from './lock.svg?react'
import Mark from './mark.svg?react'
import Molecule from './molecule.svg?react'
import Parachute from './parachute.svg?react'
import Rocket from './rocket.svg?react'
import Stablecoin from './stablecoin.svg?react'
import Stack from './stack.svg?react'
import Synchronous from './synchronous.svg?react'
import TaxTheft from './taxTheft.svg?react'
import Telegram from './telegram.svg?react'
import Twitter from './twitter.svg?react'
import ZkChains from './zkChains.svg?react'

export const icons = {
  arrowRight: { Component: ArrowRight },
  arrowTopRight: { Component: ArrowTopRight },
  discord: { Component: Discord },
  github: { Component: Github },
  gitlab: { Component: Gitlab },
  telegram: { Component: Telegram },
  twitter: { Component: Twitter },
  cube_1: { Component: Cube_1 },
  cube_2: { Component: Cube_2 },
  cube_3: { Component: Cube_3 },
  cube_4: { Component: Cube_4 },
  cube_5: { Component: Cube_5 },
  cube_6: { Component: Cube_6 },
  linkedin: { Component: Linkedin },
  lightning: { Component: Lightning },
  synchronous: { Component: Synchronous },
  taxTheft: { Component: TaxTheft },
  zkChains: { Component: ZkChains },
  parachute: { Component: Parachute },
  dex: { Component: Dex },
  infinity: { Component: InfinityIcon },
  stablecoin: { Component: Stablecoin },
  caravel: { Component: Caravel },
  blocks: { Component: Blocks },
  clock: { Component: Clock },
  flag: { Component: Flag },
  lock: { Component: Lock },
  molecule: { Component: Molecule },
  stack: { Component: Stack },
  mark: { Component: Mark },
  governance: { Component: Governance },
  rocket: { Component: Rocket },
} as const

export type IconName = keyof typeof icons
