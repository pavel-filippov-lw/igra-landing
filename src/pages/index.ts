export * from './IgraTokenPage'
export * from './BenefitsPage'
export * from './BenefitsPage2'
export * from './EcosystemPage'
export * from './HeroPage'
export * from './ManifestoPage'
export { default as PrivacyPage } from './PrivacyPage'
export { default as TermsPage } from './TermsPage'
export * from './TeamPage'
export * from './VisionPage'
export * from './NewsPage'
export * from './PublicAuctionPage'
export * from './NodesPage'
export * from './MultitudePage'
export * from './MediaPage'
// NOTE: TangemClaimPage is intentionally NOT re-exported here. It is lazy-loaded
// directly in AppRouter via dynamic import so its heavy WalletConnect/AppKit deps
// stay code-split out of the main bundle. Importing it through this barrel would
// pull those deps back into the main chunk.
