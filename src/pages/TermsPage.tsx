import { FC } from "react"

import { PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

export const TermsPage: FC = () => {
  return (
    <PageLayout>
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        style={{
          minHeight: '100vh',
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <div style={{ width: '100%', lineHeight: '1.6' }}>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: '2rem' }}>
            TERMS OF SERVICE
          </h2>

          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Igra Association</strong>
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>
            <strong>Effective date:</strong> 5 March 2026
          </p>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              1. ABOUT IGRA ASSOCIATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              These Terms of Service ("Terms") govern your access to and use of the website at igralabs.com and any associated subdomains, APIs, developer portals, and documentation (collectively, the "Site") operated by Igra Association, a Swiss association registered in Zug, Switzerland ("Igra", "we", "us", or "our").
            </p>
            <p style={{ marginBottom: '2rem' }}>
              Igra Association develops and promotes Igra Network, an EVM-compatible Layer 2 based rollup built on Kaspa's BlockDAG architecture.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              2. ACCEPTANCE OF TERMS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              By accessing or using the Site, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Site.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              The Site provides informational and technical content only. Nothing on this Site constitutes financial, investment, legal, or tax advice.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              3. ELIGIBILITY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              You may use the Site only if you:
            </p>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Are at least 18 years of age (or the age of majority in your jurisdiction);</li>
              <li style={{ marginBottom: '0.5rem' }}>Are not located in, ordinarily resident in, or organized under the laws of a jurisdiction subject to comprehensive sanctions (including the United States, where token-related features may be restricted);</li>
              <li style={{ marginBottom: '0.5rem' }}>Are not on any sanctions list maintained by Switzerland (SECO), the EU, the UN, or other applicable authorities;</li>
              <li style={{ marginBottom: '0.5rem' }}>Are legally permitted to access digital asset-related information in your jurisdiction.</li>
            </ul>
            <p style={{ marginBottom: '2rem' }}>
              By using the Site you represent and warrant that you meet all eligibility requirements.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              4. DESCRIPTION OF SERVICES
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The Site provides:
            </p>
            <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Marketing and informational content about Igra Network, its architecture, roadmap, and ecosystem;</li>
              <li style={{ marginBottom: '0.5rem' }}>Token Generation Event (TGE) information including details about the IGRA token, tokenomics, and participation conditions;</li>
              <li style={{ marginBottom: '0.5rem' }}>Developer documentation including technical specifications, API references, and integration guides for building on Igra Network.</li>
            </ul>
            <p style={{ marginBottom: '2rem' }}>
              We reserve the right to modify, suspend, or discontinue any part of the Site at any time without notice.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              5. TOKEN & TGE DISCLAIMER
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Information published on this Site regarding the IGRA token and any Token Generation Event is for informational purposes only and does not constitute:
            </p>
            <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>An offer or solicitation to buy or sell securities or financial instruments;</li>
              <li style={{ marginBottom: '0.5rem' }}>Investment advice or a recommendation to participate in the TGE;</li>
              <li style={{ marginBottom: '0.5rem' }}>A prospectus, offering memorandum, or similar regulated document.</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              The IGRA token is a utility token intended for use within the Igra Network ecosystem. Igra Association has taken steps to structure the token in accordance with applicable Swiss law and the EU Markets in Crypto-Assets Regulation (MiCA); however, the regulatory treatment of digital assets varies by jurisdiction and may change.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Participation in any token sale or TGE involves significant risks, including possible loss of the entire amount contributed. You should conduct your own due diligence and consult qualified advisors before making any decision.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              Residents and citizens of the United States of America are not permitted to participate in the TGE and should not rely on token-related content on this Site.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              6. DEVELOPER DOCUMENTATION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Technical documentation, code samples, and API specifications published on the Site are provided under the applicable open-source license noted in the relevant repository. Where no license is specified, you may use such materials solely for the purpose of integrating with or building on Igra Network.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              Igra Association makes no warranties regarding the accuracy, completeness, or fitness for purpose of any technical documentation. Breaking changes may occur without prior notice during pre-mainnet phases.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              7. INTELLECTUAL PROPERTY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              All content on the Site — including text, graphics, logos, and the "Igra" and "Igra Network" trademarks — is owned by or licensed to Igra Association and protected under applicable intellectual property laws.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              You may not reproduce, distribute, or create derivative works from Site content without our prior written permission, except as expressly permitted by an applicable open-source license or for personal, non-commercial reference use.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              8. PROHIBITED CONDUCT
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              When using the Site, you agree not to:
            </p>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Violate any applicable law or regulation;</li>
              <li style={{ marginBottom: '0.5rem' }}>Misrepresent your identity or affiliation with Igra Association;</li>
              <li style={{ marginBottom: '0.5rem' }}>Attempt to gain unauthorized access to any part of the Site or related systems;</li>
              <li style={{ marginBottom: '0.5rem' }}>Scrape, crawl, or harvest content in a manner that disrupts normal Site operation;</li>
              <li style={{ marginBottom: '0.5rem' }}>Use the Site to disseminate spam, malware, or fraudulent content;</li>
              <li style={{ marginBottom: '0.5rem' }}>Circumvent eligibility restrictions through technical or other means.</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              9. DISCLAIMERS
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              The Site and all content are provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              Igra Association does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. Blockchain networks, including Igra Network, are experimental technology and carry inherent technical and financial risks.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              10. LIMITATION OF LIABILITY
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              To the maximum extent permitted by applicable law, Igra Association and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or digital assets, arising out of or in connection with your use of the Site or any token-related activity, even if advised of the possibility of such damages.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability, Igra Association's liability is limited to the fullest extent permitted by law.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              11. GOVERNING LAW & DISPUTE RESOLUTION
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              These Terms are governed by and construed in accordance with the laws of Switzerland, without regard to its conflict of law provisions.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              Any dispute arising out of or relating to these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of the Canton of Zug, Switzerland. Before initiating formal proceedings, you agree to attempt good-faith resolution by contacting us at the address below.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              12. CHANGES TO TERMS & CONTACT
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              We may revise these Terms at any time. Material changes will be posted on this page with an updated effective date. Continued use of the Site after changes constitutes acceptance of the revised Terms.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              For questions regarding these Terms, contact:
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Igra Association</strong>
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Zug, Switzerland
            </p>
            <p style={{ marginBottom: '2rem' }}>
              <a href="mailto:legal@igra.network" style={{ color: '#6BD1C3' }}>legal@igra.network</a>
            </p>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
            © 2026 Igra Association — Zug, Switzerland
          </p>

        </div>
      </Flex>
    </PageLayout>
  );
};

export default TermsPage;
// trigger rebuild
