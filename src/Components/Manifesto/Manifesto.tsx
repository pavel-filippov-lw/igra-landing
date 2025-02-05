import { FC } from "react"

import { Flex } from "~/shared/ui"

import { ManifestoBenefits } from "../ManifestoBenefits"
import { ManifestoVision } from "../ManifestoVision"
import classes from './Manifesto.module.scss'

export const Manifesto: FC = () => {
  return (
    <div className={classes.root}>
      <Flex className={classes.content}>
        <div className={classes.leftSide}>
          <h1 className={classes.title}>Manifesto</h1>
          <div className={classes.description}>
            Igra was founded on the principle that decentralization is freedom.
            We believe in building open, borderless,
            and censorship-resistant networks that empower individuals rather than gatekeepers.
            Our vision extends beyond mere infrastructure upgrades or feature enhancements:
            we strive to deliver true economic sovereignty and uncompromising trustlessness in all our protocols.
          </div>
        </div>
        <div className={classes.image} />
      </Flex>
      <ManifestoBenefits className={classes.benefits} />
      <ManifestoVision />
    </div>
  )
}
