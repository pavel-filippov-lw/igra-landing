import { FC } from "react"

import classes from './Manifesto.module.scss'

export const Manifesto: FC = () => {
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Manifesto</h1>
      <div className={classes.content}>
        <div>Igra was founded on the principle that decentralization is freedom. We believe in building open, borderless, and censorship-resistant networks that empower individuals rather than gatekeepers. Our vision extends beyond mere infrastructure upgrades or feature enhancements: we strive to deliver true economic sovereignty and uncompromising trustlessness in all our protocols.</div>
        <ol>
          <li><b>Maximal Decentralization</b><br/>Every system we design must protect the autonomy of its participants. From consensus to governance, power is distributed among the community rather than consolidated in the hands of a few.</li>
          <li><b>Open-Source, Permissionless Innovation</b><br/>We are committed to fostering an ecosystem where anyone can build, improve, or challenge our work. By embracing a culture of open development, we unlock collective creativity and create unstoppable tools for financial freedom.</li>
          <li><b>Sovereignty Over Convenience</b><br/>While ease of use is important, we prioritize user sovereignty above all. We reject any trade-offs that compromise self-custody, immutable code, or personal control.</li>
          <li><b>Global Interoperability</b><br/>Igra bridges blockchains, VMs, and ecosystems to form a globally connected network of applications and assets. Our ultimate goal is an internet of value—an inclusive digital economy accessible to everyone, anywhere.</li>
          <li><b>Resilience and Longevity</b><br/>By embedding crypto-maximalist ideals into our protocols—robust cryptography, verifiable execution, and zero-knowledge proofs—we ensure the durability of our technology far beyond the lifespan of any single company or governing body.</li>
        </ol>
        <div>Our mission is to empower individuals with tools that uphold the purest ideals of crypto: decentralization, security, and freedom. By aligning with these core tenets, Igra intends to lead the charge in creating a trustless, borderless, and self-sovereign world.</div>
      </div>
    </div>
  )
}
