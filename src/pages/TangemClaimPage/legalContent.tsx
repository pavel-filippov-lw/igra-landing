import { FC } from 'react'

import classes from './LegalModal.module.scss'

const CONTACT = 'giveaway@igra.network'

/** Organizer / controller address block, reused in both documents. */
const OrgAddress: FC = () => (
  <p className={classes.addr}>
    <strong>Igra Association</strong>
    <br />
    CHE-138.661.280
    <br />
    c/o Sielva Management SA
    <br />
    Gubelstrasse 11
    <br />
    6300 Zug, Switzerland
  </p>
)

/** ── Giveaway Rules ─────────────────────────────────────────────────── */
export const GIVEAWAY_RULES_TITLE = 'Igra × Tangem ZAP Wallet Giveaway Rules'

export const GiveawayRules: FC = () => (
  <>
    <p className={classes.effective}>Effective date: 3 August 2026</p>

    <h3>1. Organizer and purpose</h3>
    <p>
      The Igra × Tangem ZAP Wallet Giveaway (the <strong>“Giveaway”</strong>) is organized by:
    </p>
    <OrgAddress />
    <p>(the <strong>“Organizer”</strong>)</p>
    <p>
      The Giveaway fulfils the Tangem wallet draw announced to participants in the Igra ZAP in
      February 2026. It is not a new public acquisition campaign.
    </p>
    <p>
      Tangem provides the prizes and supports the wallet technology. Tangem is not the Organizer and
      does not determine eligibility or select the winners.
    </p>

    <h3>2. Prizes</h3>
    <p>The Giveaway offers ten prizes.</p>
    <p>
      Each prize consists of one Tangem Wallet three-card set, with an approximate retail value of
      USD 63.
    </p>
    <p>Prizes cannot be exchanged for cash, tokens or another product.</p>

    <h3>3. Eligibility</h3>
    <p>A wallet is eligible if:</p>
    <ol>
      <li>it appears in the published ZAP eligibility snapshot;</li>
      <li>
        it recorded at least 500 iKAS in gross successful bids under the published snapshot
        methodology;
      </li>
      <li>its holder completes registration within the registration period; and</li>
      <li>participation and delivery of the prize are lawful in the participant’s place of residence.</li>
    </ol>
    <p>
      Participants must be at least 18 years old or have reached the age of majority in their place
      of residence.
    </p>
    <p>
      Persons excluded under the original ZAP terms, persons subject to applicable sanctions, and
      persons located in jurisdictions where the Giveaway or delivery of the prize is prohibited are
      not eligible.
    </p>
    <p>
      The eligibility snapshot and methodology are published in the{' '}
      <code>IgraLabs/tangem-zap-giveaway-2026</code> GitHub repository.
    </p>
    <p>
      No additional purchase, payment, token transfer or blockchain transaction is required to
      register.
    </p>

    <h3>4. Registration</h3>
    <p>
      Registration opens on <strong>3 August 2026</strong> and closes on{' '}
      <strong>15 August 2026 at 23:59 UTC</strong>.
    </p>
    <p>To register, a participant must:</p>
    <ol>
      <li>connect an eligible wallet;</li>
      <li>sign a gas-free message proving control of that wallet; and</li>
      <li>verify an email address.</li>
    </ol>
    <p>
      The signature proves control of the wallet only. It does not authorize a transaction or give
      the Organizer access to the wallet or its assets.
    </p>
    <p>
      Each eligible wallet receives one entry. The same email address may be used to register more
      than one independently eligible wallet.
    </p>
    <p>
      A natural person or household may receive no more than one prize. For this purpose, a household
      means persons using the same principal residential delivery address.
    </p>

    <h3>5. Draw</h3>
    <p>
      The Organizer will conduct a deterministic shuffle using a precommitted Kaspa L1 randomness
      source.
    </p>
    <p>Before the selected randomness becomes available, the Organizer will publish:</p>
    <ul>
      <li>the draw method and source code;</li>
      <li>the relevant source-code commit;</li>
      <li>the eligibility-snapshot hash;</li>
      <li>the registered-candidate-set hash;</li>
      <li>the Kaspa block-selection rule; and</li>
      <li>the encoding and seed-construction rules.</li>
    </ul>
    <p>
      The first ten valid entries in the resulting ranking will be provisional winners. The remaining
      entries will form the reserve ranking.
    </p>
    <p>
      After the draw, the Organizer will publish all ten provisional winning wallet addresses in
      shortened form, together with the draw inputs and verification records.
    </p>

    <h3>6. Claiming a prize</h3>
    <p>
      Provisional winners will be contacted using the verified email address submitted during
      registration.
    </p>
    <p>
      Each winner has <strong>14 calendar days</strong> from the date of notification to:
    </p>
    <ol>
      <li>sign a new message using the winning wallet; and</li>
      <li>provide the information required to deliver the prize.</li>
    </ol>
    <p>A prize will pass to the next eligible reserve if the provisional winner:</p>
    <ul>
      <li>does not respond within the claim period;</li>
      <li>cannot prove control of the winning wallet;</li>
      <li>provides materially incorrect information;</li>
      <li>is not eligible;</li>
      <li>cannot lawfully receive the prize; or</li>
      <li>would breach the one-prize-per-person-or-household limit.</li>
    </ul>

    <h3>7. Delivery</h3>
    <p>
      The Organizer will cover standard shipping to destinations where it can lawfully send the prize
      using ordinary postal or parcel services.
    </p>
    <p>Tracking may not be available for every destination.</p>
    <p>
      Recipients are responsible for customs duties, import charges and local taxes, where
      applicable.
    </p>
    <p>
      The Organizer is not responsible for delays or failed delivery caused by customs authorities,
      delivery providers, local restrictions or incorrect delivery information.
    </p>
    <p>
      If the Organizer cannot lawfully or reasonably deliver a prize to the address provided, the
      prize will pass to the next eligible reserve.
    </p>

    <h3>8. Administration</h3>
    <p>
      The Organizer may reject registrations involving manipulation, automated abuse, false
      information, sanctions risk or interference with the registration or draw process.
    </p>
    <p>
      If a technical failure or legal requirement materially affects the Giveaway, the Organizer may
      postpone, modify or cancel it. Any material change and its reason will be published.
    </p>
    <p>Personal data is processed as described in the Giveaway Privacy Notice.</p>

    <h3>9. Governing law</h3>
    <p>These Rules are governed by Swiss law.</p>
    <p>
      The courts at the registered seat of the Organizer have jurisdiction, subject to any mandatory
      consumer rights or jurisdiction that cannot lawfully be excluded.
    </p>
    <p>
      Questions may be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
    </p>
  </>
)

/** ── Privacy Notice ─────────────────────────────────────────────────── */
export const PRIVACY_NOTICE_TITLE = 'Igra × Tangem ZAP Wallet Giveaway Privacy Notice'

export const PrivacyNotice: FC = () => (
  <>
    <p className={classes.effective}>Effective date: 3 August 2026</p>
    <p>The controller responsible for the Giveaway is:</p>
    <OrgAddress />
    <p>
      Privacy enquiries may be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
    </p>

    <h3>Data collected</h3>
    <p>For entrants, the Organizer processes:</p>
    <ul>
      <li>wallet address;</li>
      <li>signed ownership message and signature;</li>
      <li>email address and verification status;</li>
      <li>registration, eligibility and draw records.</li>
    </ul>
    <p>
      For provisional winners, the Organizer also collects the name, delivery address, telephone
      number where required by the carrier, and other information needed to deliver the prize.
    </p>
    <p>The Organizer never requests private keys or seed phrases.</p>

    <h3>Use of data</h3>
    <p>The data is used only to:</p>
    <ul>
      <li>verify wallet control and eligibility;</li>
      <li>administer and document the draw;</li>
      <li>contact and verify winners;</li>
      <li>enforce the one-prize-per-person-or-household limit;</li>
      <li>arrange delivery; and</li>
      <li>meet applicable legal and sanctions requirements.</li>
    </ul>
    <p>Giveaway data will not be used for marketing.</p>

    <h3>Publication</h3>
    <p>
      The eligibility snapshot, source code, cryptographic commitments and draw records will be
      published on GitHub.
    </p>
    <p>
      The registered candidate set will be represented publicly by a cryptographic hash. The complete
      registered candidate list, email addresses, signatures, names and delivery details will not be
      published.
    </p>
    <p>After the draw, all provisional winning wallet addresses will be published in shortened form.</p>

    <h3>Sharing and retention</h3>
    <p>
      Data may be shared with service providers required to operate email verification or deliver a
      winner’s prize.
    </p>
    <p>
      Non-winner email addresses and private registration records will be deleted or anonymized
      within <strong>30 days after all prizes have been fulfilled</strong>.
    </p>
    <p>
      Winner delivery information will be deleted or anonymized within{' '}
      <strong>90 days after confirmed delivery</strong>, unless required for an unresolved delivery
      or legal matter.
    </p>
    <p>
      Published blockchain information, hashes and draw-verification records may remain publicly
      available.
    </p>
    <p>
      Participants may request access to, correction or deletion of their personal data by contacting{' '}
      <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Deleting information required to administer the
      Giveaway before the draw or delivery is complete may invalidate the corresponding entry or
      prize claim.
    </p>
  </>
)
