import ArrowRight from './arrowRight.svg?react'
import Cube_1 from './cube_1.svg?react'
import Cube_2 from './cube_2.svg?react'
import Cube_3 from './cube_3.svg?react'
import Cube_4 from './cube_4.svg?react'
import Cube_5 from './cube_5.svg?react'
import Cube_6 from './cube_6.svg?react'
import Dex from './dex.svg?react'
import Discord from './discord.svg?react'
import Github from './github.svg?react'
import Gitlab from './gitlab.svg?react'
import InfinityIcon from './infinity.svg?react'
import Lightning from './lightning.svg?react'
import Linkedin from './linkedin.svg?react'
import Lock from './lock.svg?react'
import Parachute from './parachute.svg?react'
import Stablecoin from './stablecoin.svg?react'
import Synchronous from './synchronous.svg?react'
import TaxTheft from './taxTheft.svg?react'
import Telegram from './telegram.svg?react'
import Twitter from './twitter.svg?react'
import ZkChains from './zkChains.svg?react'
import Caravel from './caravel.svg?react'

export const icons = {
  arrowRight: { Component: ArrowRight },
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
  lock: { Component: Lock },
  synchronous: { Component: Synchronous },
  taxTheft: { Component: TaxTheft },
  zkChains: { Component: ZkChains },
  parachute: { Component: Parachute },
  dex: { Component: Dex },
  infinity: { Component: InfinityIcon },
  stablecoin: { Component: Stablecoin },
  caravel: { Component: Caravel }
} as const

export type IconName = keyof typeof icons
