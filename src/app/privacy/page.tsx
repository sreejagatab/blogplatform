import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Universal Blog Platform Privacy Policy - Learn how we collect, use, and protect your personal information.',
}

const lastUpdated = 'December 26, 2024'

export default function PrivacyPage() {
  return (
    <PageLayout>
      <PageHero
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: {lastUpdated}</CardTitle>
              <CardDescription>
                This Privacy Policy describes how Universal Blog Platform ("we," "our," or "us") collects, uses, and shares your personal information when you use our services.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, and profile information</li>
              <li><strong>Content:</strong> Blog posts, images, videos, and other content you create or upload</li>
              <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by our payment providers)</li>
              <li><strong>Communications:</strong> Messages you send to us through support channels or feedback forms</li>
            </ul>

            <h3>Information We Collect Automatically</h3>
            <ul>
              <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Analytics Data:</strong> Performance metrics, engagement statistics, and platform-specific data</li>
              <li><strong>Cookies and Tracking:</strong> Information collected through cookies and similar technologies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you about products, services, and promotional offers</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve your experience</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            
            <p>We may share your information in the following circumstances:</p>
            
            <h3>With Your Consent</h3>
            <p>We share information when you explicitly consent, such as when connecting third-party platforms or sharing content publicly.</p>

            <h3>Service Providers</h3>
            <p>We work with third-party service providers who perform services on our behalf, including:</p>
            <ul>
              <li>Cloud hosting and storage providers</li>
              <li>Payment processing companies</li>
              <li>Analytics and monitoring services</li>
              <li>Customer support platforms</li>
              <li>Email and communication services</li>
            </ul>

            <h3>Platform Integrations</h3>
            <p>When you connect third-party platforms (social media, blog platforms, etc.), we share necessary information to publish your content according to your instructions.</p>

            <h3>Legal Requirements</h3>
            <p>We may disclose information if required by law, regulation, legal process, or governmental request.</p>

            <h3>Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>

            <h2>4. Data Security</h2>
            
            <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <h2>5. Data Retention</h2>
            
            <p>We retain your information for as long as necessary to:</p>
            <ul>
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services and develop new features</li>
            </ul>
            
            <p>You can request deletion of your account and associated data at any time through your account settings or by contacting us.</p>

            <h2>6. Your Rights and Choices</h2>
            
            <h3>Access and Control</h3>
            <ul>
              <li><strong>Account Information:</strong> Update your account information through your profile settings</li>
              <li><strong>Content:</strong> Edit, delete, or export your content at any time</li>
              <li><strong>Communications:</strong> Opt out of promotional emails through unsubscribe links or account settings</li>
              <li><strong>Cookies:</strong> Control cookie preferences through your browser settings</li>
            </ul>

            <h3>Data Subject Rights (GDPR)</h3>
            <p>If you're in the European Union, you have additional rights including:</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate data</li>
              <li>Right to erase your data</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>

            <h2>7. International Data Transfers</h2>
            
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:</p>
            <ul>
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Other legally recognized transfer mechanisms</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.</p>

            <h2>9. Third-Party Links and Services</h2>
            
            <p>Our platform may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to those external sites or services. We encourage you to review their privacy policies.</p>

            <h2>10. Changes to This Policy</h2>
            
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to your registered email address</li>
              <li>Providing notice through our platform</li>
            </ul>

            <h2>11. Contact Us</h2>
            
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@universalblog.com</li>
              <li><strong>Address:</strong> Universal Blog Platform, 123 Privacy Street, San Francisco, CA 94105</li>
              <li><strong>Data Protection Officer:</strong> dpo@universalblog.com</li>
            </ul>

            <h2>12. California Privacy Rights</h2>
            
            <p>If you're a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, use, and share about you, and the right to request deletion of your personal information.</p>
            
            <p>To exercise these rights, please contact us using the information provided above.</p>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
