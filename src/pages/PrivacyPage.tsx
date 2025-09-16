import { FC } from "react"

import { PageLayout } from "~/Components"
import { Flex } from "~/shared/ui"

export const PrivacyPage: FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
            Privacy Policy
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>
            <strong>Last updated:</strong> {currentDate}
          </p>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Information We Collect
            </h3>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Network Data</strong>: When you use our RPC endpoints, we may collect basic network usage data such as request frequency and error rates for service improvement.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Website Analytics</strong>: Our website may use standard web analytics to understand how users interact with our documentation and services.
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              How We Use Information
            </h3>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>To provide and maintain our blockchain network services</li>
              <li style={{ marginBottom: '0.5rem' }}>To improve our RPC performance and reliability</li>
              <li style={{ marginBottom: '0.5rem' }}>To provide technical support when requested</li>
              <li style={{ marginBottom: '0.5rem' }}>To detect and prevent network abuse or attacks</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Information Sharing
            </h3>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>We do not sell or rent your personal information to third parties</li>
              <li style={{ marginBottom: '0.5rem' }}>We may share aggregated, non-personal data for research or development purposes</li>
              <li style={{ marginBottom: '0.5rem' }}>We may disclose information if required by law or to protect our services</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Blockchain Data
            </h3>
            <ul style={{ paddingLeft: '2rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>All blockchain transactions are public by nature</li>
              <li style={{ marginBottom: '0.5rem' }}>We do not control or own data stored on the Igra blockchain</li>
              <li style={{ marginBottom: '0.5rem' }}>Users are responsible for their own wallet security and private keys</li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Data Security
            </h3>
            <p style={{ marginBottom: '2rem' }}>
              We implement reasonable security measures to protect against unauthorized access to our services.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Contact Us
            </h3>
            <p style={{ marginBottom: '2rem' }}>
              For privacy-related questions, contact us at: info@igralabs.com
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Changes to Policy
            </h3>
            <p style={{ marginBottom: '2rem' }}>
              We may update this policy periodically. Continued use of our services constitutes acceptance of any changes.
            </p>
          </div>
        </div>
      </Flex>
    </PageLayout>
  );
};

export default PrivacyPage;