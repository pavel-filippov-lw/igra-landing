import { Routes } from './Routes.ts'

class To {
  hero = () => `/${Routes.hero}`

  team = () => `/${Routes.team}`

  manifesto = () => `/${Routes.manifesto}`

  vision = () => `/${Routes.vision}`

  ecosystem = () => `/${Routes.ecosystem}`

  privacy = () => `/${Routes.privacy}`

  benefits = (benefitId = '0') => `/${Routes.benefits}?benefitId=${benefitId}`

  benefits2 = (benefitId = '0') => `/${Routes.benefits2}?benefitId=${benefitId}`

  igraToken = () => `/${Routes.igraToken}`
}

export const to = new To()

export type Paths = ReturnType<To[keyof To]>;
