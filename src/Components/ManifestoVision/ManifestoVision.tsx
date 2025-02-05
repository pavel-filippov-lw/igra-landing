import { FC, Fragment } from "react"

import { Flex } from "~/shared/ui"

import classes from './ManifestoVision.module.scss'

const paragraphsList = [
  'Igra\'s endgame is to deliver a platform that combines Bitcoin-grade security with the versatility of modern programmable chains. We aim to unify any kind of decentralized VMs under one roof, making them secure, ultra-fast, MEV-resistant and interoperable.',
  'Although existing blockchain programmability layers have achieved significant adoption, we see they are deadlocked by compromises made in terms of scalability, decentralization, and security. We believe this is an inevitable consequence of choosing PoS as the core consensus principle and settling for a technical roadmap that promotes endless fragmentation. This approach merely produces variations of the same technological stack, offering little to no benefit for users, institutions, or retail participants alike.',
  'Until recently, technological limitations prevented integrating modern VMs with PoW-based systems. While BitVM and zkVMs have made Bitcoin ZK rollups possible, native ZK verification on Bitcoin lacks a clear timeline. Even when implemented, these rollups can only use Bitcoin\'s base layer for settlement, lacking data availability and sequencing capabilities.',
  'Ethereum\'s rollup-centric model has trapped its ecosystem in iterative prisoner\'s dilemma games, resulting in fragmented liquidity, limited scaling, and distorted economic incentives for base layer development.',
  'Kaspa BlockDAG represents an attempt to surpass the limits of Nakamoto consensus. It prioritizes rapid transaction inclusion and control over transaction ordering in the ledger. Kaspa\'s vision is to create a ledger that operates at network speed limits, with an architecture supporting a programmability layers that inherits both the speed and security of its base layer.',
  'By establishing transaction ordering at L1 and deterministically derive the L2 state directly from the base layer, it eliminates the need for additional consensus mechanisms. This approach combines the best of all architectures: Bitcoin, Ethereum (rollup-centric roadmap), an Internet-speed version of Nakamoto base layer, a zk-based computation layer, and a Solana-like unified defragmented state.',
  'We see this as a unique opportunity to build a new type of programmable system, one that transcends the limitations of its predecessors. Like its Aramaic meaning of "Rooftop", Igra aims to be the unifying layer under which different decentralized virtual machines can thrive.',
  'First, we plan to build an L2 on top of Kaspa, with a canonical bridge between L1 and L2, supporting up to 3,000 TPS with sub-second finality. It will be EVM-compatible, enabling seamless use of existing Ethereum tools.',
  'We believe MEV-resistance is essential to align economic incentives between L2 and L1. Kaspa L1\'s scalable leaderless DAG design with intra-round mechanism will establish a fair auction system through parallel block creation, preventing transaction reordering. This architecture will serve as the foundation for Igra L2\'s inherent protection against MEV.',
  'And this is only the beginning. By leveraging Kaspa\'s planned support for synchronous atomic composability, Igra will enable interoperability between systems with any type of VM—whether Solana VM, Move, or WASM. Igra will allow smart contracts to interact seamlessly across different L2s, regardless of which virtual machine they use. This enables a completely new type of composability. Similar to how an operating system runs programs in any language that can communicate and share state, specialized smart contracts in different languages can be composed into powerful meta-dApps.',
  'By leveraging Kaspa L1\'s sequencing and messaging protocol, Igra delivers an unprecedented combination of scalability, security, and interoperability. This empowers builders to create unstoppable, real-time, censorship-resistant and infinitely composable applications that expand Satoshi\'s original vision of trustless electronic money into a truly trustless and scalable digital economy.',
]

export const ManifestoVision: FC = () => {
  return (
    <Flex
      flexDirection='column'
      gap={30}
    >
      <h2 className={classes.title}>Vision</h2>
      <div className={classes.text}>
        {paragraphsList.map((part, index) => (
          <Fragment key={index}>
            <p>{part}</p>
            {index !== paragraphsList.length - 1 && <br />}
          </Fragment>
        ))}
      </div>
    </Flex>
  )
}
