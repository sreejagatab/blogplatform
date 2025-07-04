import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Universal Blog Platform Cookie Policy - Learn about how we use cookies and similar technologies.',
}

const lastUpdated = 'December 26, 2024'

const cookieTypes = [
  {
    type: 'Essential Cookies',
    purpose: 'Required for basic website functionality',
    examples: ['Authentication', 'Security', 'Form submissions', 'Load balancing'],
    canDisable: false,
    retention: 'Session or up to 1 year'
  },
  {
    type: 'Performance Cookies',
    purpose: 'Help us understand how visitors use our website',
    examples: ['Page views', 'Click tracking', 'Error monitoring', 'Performance metrics'],
    canDisable: true,
    retention: 'Up to 2 years'
  },
  {
    type: 'Functional Cookies',
    purpose: 'Remember your preferences and settings',
    examples: ['Language preferences', 'Theme settings', 'Dashboard layout', 'Notification preferences'],
    canDisable: true,
    retention: 'Up to 1 year'
  },
  {
    type: 'Marketing Cookies',
    purpose: 'Used to deliver relevant advertisements',
    examples: ['Ad targeting', 'Campaign tracking', 'Social media integration', 'Conversion tracking'],
    canDisable: true,
    retention: 'Up to 2 years'
  }
]

const thirdPartyServices = [
  {
    service: 'Google Analytics',
    purpose: 'Website analytics and performance monitoring',
    cookies: ['_ga', '_gid', '_gat'],
    privacy: 'https://policies.google.com/privacy'
  },
  {
    service: 'Stripe',
    purpose: 'Payment processing and fraud prevention',
    cookies: ['__stripe_mid', '__stripe_sid'],
    privacy: 'https://stripe.com/privacy'
  },
  {
    service: 'Intercom',
    purpose: 'Customer support and communication',
    cookies: ['intercom-*'],
    privacy: 'https://www.intercom.com/legal/privacy'
  },
  {
    service: 'Hotjar',
    purpose: 'User experience and behavior analysis',
    cookies: ['_hjid', '_hjSessionUser_*'],
    privacy: 'https://www.hotjar.com/legal/policies/privacy/'
  }
]

export default function CookiesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Cookie Policy"
        description="Learn about how Universal Blog Platform uses cookies and similar technologies to improve your experience."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: {lastUpdated}</CardTitle>
              <CardDescription>
                This Cookie Policy explains how Universal Blog Platform uses cookies and similar technologies when you visit our website or use our services.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What Are Cookies?</h2>
            
            <p>Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings. This can make your next visit easier and the site more useful to you.</p>

            <p>Similar technologies include:</p>
            <ul>
              <li><strong>Web beacons:</strong> Small graphic images used to track user behavior</li>
              <li><strong>Local storage:</strong> Data stored locally in your browser</li>
              <li><strong>Session storage:</strong> Temporary data stored for the duration of your session</li>
              <li><strong>Pixels:</strong> Tiny images used for tracking and analytics</li>
            </ul>

            <h2>How We Use Cookies</h2>
            
            <p>We use cookies for several purposes:</p>
            <ul>
              <li>To provide essential website functionality</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze website performance and usage</li>
              <li>To personalize your experience</li>
              <li>To deliver relevant content and advertisements</li>
              <li>To protect against fraud and security threats</li>
            </ul>

            <h2>Types of Cookies We Use</h2>
            
            <div className="not-prose mb-8">
              <div className="space-y-6">
                {cookieTypes.map((cookie, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{cookie.type}</CardTitle>
                        <Badge variant={cookie.canDisable ? "secondary" : "default"}>
                          {cookie.canDisable ? "Optional" : "Required"}
                        </Badge>
                      </div>
                      <CardDescription>{cookie.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Examples:</h4>
                          <ul className="text-sm space-y-1">
                            {cookie.examples.map((example, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Retention Period:</h4>
                          <p className="text-sm text-muted-foreground">{cookie.retention}</p>
                          <h4 className="font-semibold mb-2 mt-3">Can be disabled:</h4>
                          <p className="text-sm text-muted-foreground">
                            {cookie.canDisable ? "Yes, through cookie preferences" : "No, required for functionality"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2>Third-Party Cookies</h2>
            
            <p>We work with third-party service providers who may set cookies on our website. These cookies help us provide better services and understand how our website is used.</p>

            <div className="not-prose mb-8">
              <div className="space-y-4">
                {thirdPartyServices.map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{service.service}</h3>
                        <a 
                          href={service.privacy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </div>
                      <p className="text-muted-foreground mb-3">{service.purpose}</p>
                      <div>
                        <h4 className="font-medium mb-2">Cookies used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.cookies.map((cookie, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cookie}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2>Managing Your Cookie Preferences</h2>
            
            <h3>Cookie Settings</h3>
            <p>You can manage your cookie preferences through our cookie consent banner or by visiting your account settings. You can:</p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your preferences by cookie type</li>
              <li>Change your preferences at any time</li>
            </ul>

            <h3>Browser Settings</h3>
            <p>You can also control cookies through your browser settings:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3>Opt-Out Links</h3>
            <p>You can opt out of certain third-party cookies:</p>
            <ul>
              <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
              <li><a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank" rel="noopener noreferrer">Hotjar Opt-out</a></li>
              <li><a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a></li>
              <li><a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
            </ul>

            <h2>Impact of Disabling Cookies</h2>
            
            <p>If you choose to disable cookies, some features of our website may not function properly:</p>
            <ul>
              <li>You may need to log in repeatedly</li>
              <li>Your preferences and settings may not be saved</li>
              <li>Some personalized features may not work</li>
              <li>Analytics and performance monitoring may be affected</li>
            </ul>

            <h2>Updates to This Policy</h2>
            
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending email notifications for significant changes</li>
              <li>Displaying a notice on our website</li>
            </ul>

            <h2>Contact Us</h2>
            
            <p>If you have questions about our use of cookies or this Cookie Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> privacy@universalblog.com</li>
              <li><strong>Address:</strong> Universal Blog Platform, 123 Privacy Street, San Francisco, CA 94105</li>
              <li><strong>Data Protection Officer:</strong> dpo@universalblog.com</li>
            </ul>

            <h2>Additional Resources</h2>
            
            <p>For more information about cookies and online privacy:</p>
            <ul>
              <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
              <li><a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer">ICO Cookie Guidance</a></li>
              <li><a href="https://www.cookiepro.com/knowledge/what-are-cookies/" target="_blank" rel="noopener noreferrer">Cookie Education</a></li>
            </ul>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
