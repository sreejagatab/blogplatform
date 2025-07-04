import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Universal Blog Platform Terms of Service - Legal terms and conditions for using our platform.',
}

const lastUpdated = 'December 26, 2024'

export default function TermsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Terms of Service"
        description="Legal terms and conditions governing your use of Universal Blog Platform."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: {lastUpdated}</CardTitle>
              <CardDescription>
                These Terms of Service ("Terms") govern your use of Universal Blog Platform's services. By using our platform, you agree to these terms.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            
            <p>By accessing or using Universal Blog Platform ("Service," "Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Service.</p>

            <h2>2. Description of Service</h2>
            
            <p>Universal Blog Platform is a content creation and distribution platform that enables users to:</p>
            <ul>
              <li>Create and edit content using AI-powered tools</li>
              <li>Publish content across multiple platforms simultaneously</li>
              <li>Analyze content performance and engagement</li>
              <li>Collaborate with team members on content projects</li>
              <li>Access various content creation and marketing tools</li>
            </ul>

            <h2>3. User Accounts</h2>
            
            <h3>Account Creation</h3>
            <ul>
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 13 years old to create an account</li>
              <li>One person or entity may maintain only one free account</li>
            </ul>

            <h3>Account Responsibility</h3>
            <ul>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We are not liable for any loss or damage from unauthorized account access</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            
            <h3>Permitted Uses</h3>
            <p>You may use our Service for lawful purposes in accordance with these Terms, including:</p>
            <ul>
              <li>Creating original content for personal or business use</li>
              <li>Publishing content to connected platforms</li>
              <li>Collaborating with team members on content projects</li>
              <li>Analyzing content performance and engagement metrics</li>
            </ul>

            <h3>Prohibited Uses</h3>
            <p>You may not use our Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Publish spam, malicious, or deceptive content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or extract data</li>
              <li>Resell or redistribute our Service without permission</li>
            </ul>

            <h2>5. Content and Intellectual Property</h2>
            
            <h3>Your Content</h3>
            <ul>
              <li>You retain ownership of content you create and upload</li>
              <li>You grant us a license to use your content to provide our Service</li>
              <li>You are responsible for ensuring you have rights to all content you upload</li>
              <li>You represent that your content does not violate any third-party rights</li>
            </ul>

            <h3>Our Intellectual Property</h3>
            <ul>
              <li>The Platform and its features are owned by Universal Blog Platform</li>
              <li>You may not copy, modify, or distribute our proprietary technology</li>
              <li>Our trademarks and logos may not be used without permission</li>
              <li>We reserve all rights not expressly granted to you</li>
            </ul>

            <h2>6. Privacy and Data</h2>
            
            <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

            <h2>7. Payment Terms</h2>
            
            <h3>Subscription Plans</h3>
            <ul>
              <li>Paid plans are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days' notice to existing subscribers</li>
              <li>Failure to pay may result in service suspension or termination</li>
            </ul>

            <h3>Free Trial</h3>
            <ul>
              <li>Free trials are available for eligible new users</li>
              <li>Trial limitations and duration are specified at signup</li>
              <li>Trials automatically convert to paid plans unless cancelled</li>
            </ul>

            <h2>8. Service Availability</h2>
            
            <ul>
              <li>We strive to maintain high service availability but cannot guarantee 100% uptime</li>
              <li>We may perform maintenance that temporarily affects service availability</li>
              <li>We are not liable for service interruptions beyond our reasonable control</li>
              <li>Service level agreements may apply to enterprise customers</li>
            </ul>

            <h2>9. Termination</h2>
            
            <h3>Termination by You</h3>
            <ul>
              <li>You may terminate your account at any time through account settings</li>
              <li>Termination does not entitle you to a refund of prepaid fees</li>
              <li>You remain responsible for all charges incurred before termination</li>
            </ul>

            <h3>Termination by Us</h3>
            <ul>
              <li>We may suspend or terminate accounts that violate these Terms</li>
              <li>We may terminate accounts for non-payment of fees</li>
              <li>We may terminate the Service entirely with reasonable notice</li>
            </ul>

            <h2>10. Disclaimers</h2>
            
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:</p>
            <ul>
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of content</li>
              <li>Warranties that defects will be corrected</li>
            </ul>

            <h2>11. Limitation of Liability</h2>
            
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul>
              <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not liable for loss of profits, data, or business opportunities</li>
              <li>These limitations apply even if we have been advised of the possibility of damages</li>
            </ul>

            <h2>12. Indemnification</h2>
            
            <p>You agree to indemnify and hold us harmless from claims arising from:</p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit or publish through the Service</li>
            </ul>

            <h2>13. Dispute Resolution</h2>
            
            <h3>Governing Law</h3>
            <p>These Terms are governed by the laws of the State of California, without regard to conflict of law principles.</p>

            <h3>Arbitration</h3>
            <p>Disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except for claims that may be brought in small claims court.</p>

            <h2>14. Changes to Terms</h2>
            
            <p>We may modify these Terms at any time. We will notify users of material changes by:</p>
            <ul>
              <li>Posting updated Terms on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Providing notice through the Platform</li>
            </ul>
            
            <p>Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

            <h2>15. General Provisions</h2>
            
            <h3>Entire Agreement</h3>
            <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Universal Blog Platform.</p>

            <h3>Severability</h3>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>

            <h3>Assignment</h3>
            <p>You may not assign your rights under these Terms without our consent. We may assign our rights and obligations without restriction.</p>

            <h2>16. Contact Information</h2>
            
            <p>If you have questions about these Terms, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> legal@universalblog.com</li>
              <li><strong>Address:</strong> Universal Blog Platform, 123 Legal Street, San Francisco, CA 94105</li>
              <li><strong>Phone:</strong> +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
