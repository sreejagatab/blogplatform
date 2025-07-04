import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  StopCircle,
  ArrowRight,
  Mail,
  FileText,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GDPR Compliance',
  description: 'Universal Blog Platform GDPR compliance information and data subject rights for EU residents.',
}

const lastUpdated = 'December 26, 2024'

const dataSubjectRights = [
  {
    icon: Eye,
    title: 'Right to Access',
    description: 'Request a copy of the personal data we hold about you',
    action: 'Request your data',
    timeframe: '30 days'
  },
  {
    icon: Edit,
    title: 'Right to Rectification',
    description: 'Correct inaccurate or incomplete personal data',
    action: 'Update your information',
    timeframe: '30 days'
  },
  {
    icon: Trash2,
    title: 'Right to Erasure',
    description: 'Request deletion of your personal data ("right to be forgotten")',
    action: 'Delete your data',
    timeframe: '30 days'
  },
  {
    icon: StopCircle,
    title: 'Right to Restrict Processing',
    description: 'Limit how we process your personal data',
    action: 'Restrict processing',
    timeframe: '30 days'
  },
  {
    icon: Download,
    title: 'Right to Data Portability',
    description: 'Receive your data in a structured, machine-readable format',
    action: 'Export your data',
    timeframe: '30 days'
  },
  {
    icon: Shield,
    title: 'Right to Object',
    description: 'Object to processing based on legitimate interests or direct marketing',
    action: 'Object to processing',
    timeframe: '30 days'
  }
]

const legalBases = [
  {
    basis: 'Consent',
    description: 'You have given clear consent for us to process your personal data for specific purposes',
    examples: ['Marketing communications', 'Optional features', 'Third-party integrations']
  },
  {
    basis: 'Contract',
    description: 'Processing is necessary for the performance of a contract with you',
    examples: ['Account creation', 'Service delivery', 'Payment processing']
  },
  {
    basis: 'Legal Obligation',
    description: 'Processing is necessary for compliance with legal obligations',
    examples: ['Tax records', 'Fraud prevention', 'Regulatory compliance']
  },
  {
    basis: 'Legitimate Interest',
    description: 'Processing is necessary for legitimate interests pursued by us or third parties',
    examples: ['Security monitoring', 'Service improvement', 'Analytics']
  }
]

const dataCategories = [
  {
    category: 'Identity Data',
    examples: ['Name', 'Email address', 'Username', 'Profile information'],
    retention: 'Account lifetime + 7 years'
  },
  {
    category: 'Contact Data',
    examples: ['Email address', 'Phone number', 'Billing address'],
    retention: 'Account lifetime + 7 years'
  },
  {
    category: 'Financial Data',
    examples: ['Payment information', 'Billing history', 'Transaction records'],
    retention: '7 years after last transaction'
  },
  {
    category: 'Technical Data',
    examples: ['IP address', 'Browser type', 'Device information', 'Usage data'],
    retention: '2 years'
  },
  {
    category: 'Content Data',
    examples: ['Blog posts', 'Images', 'Videos', 'Comments'],
    retention: 'Until deletion by user'
  },
  {
    category: 'Marketing Data',
    examples: ['Communication preferences', 'Marketing responses'],
    retention: '3 years or until consent withdrawn'
  }
]

export default function GDPRPage() {
  return (
    <PageLayout>
      <PageHero
        title="GDPR Compliance"
        description="Your data protection rights under the General Data Protection Regulation (GDPR) and how we protect your privacy."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Last Updated: {lastUpdated}</CardTitle>
              <CardDescription>
                Universal Blog Platform is committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR) for all EU residents.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="prose prose-lg max-w-none">
            <h2>What is GDPR?</h2>
            
            <p>The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It strengthens and unifies data protection for individuals within the European Union (EU) and addresses the export of personal data outside the EU.</p>

            <p>GDPR gives you greater control over your personal data and requires organizations to be transparent about how they collect, use, and protect your information.</p>

            <h2>Your Rights Under GDPR</h2>
            
            <p>As an EU resident, you have several rights regarding your personal data:</p>

            <div className="not-prose mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dataSubjectRights.map((right, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <right.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{right.title}</CardTitle>
                      </div>
                      <CardDescription>{right.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {right.timeframe}
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/gdpr/request">
                            {right.action}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2>Legal Basis for Processing</h2>
            
            <p>We only process your personal data when we have a legal basis to do so. Under GDPR, we rely on the following legal bases:</p>

            <div className="not-prose mb-8">
              <div className="space-y-4">
                {legalBases.map((basis, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{basis.basis}</CardTitle>
                      <CardDescription>{basis.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="space-y-1">
                        {basis.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2>Data We Collect and Retain</h2>
            
            <p>We collect and process different categories of personal data for various purposes. Here's what we collect and how long we keep it:</p>

            <div className="not-prose mb-8">
              <div className="space-y-4">
                {dataCategories.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{category.category}</h3>
                        <Badge variant="secondary">{category.retention}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2>International Data Transfers</h2>
            
            <p>We may transfer your personal data outside the European Economic Area (EEA). When we do, we ensure appropriate safeguards are in place:</p>
            <ul>
              <li><strong>Adequacy Decisions:</strong> Transfers to countries deemed adequate by the European Commission</li>
              <li><strong>Standard Contractual Clauses:</strong> EU-approved contracts that provide appropriate safeguards</li>
              <li><strong>Binding Corporate Rules:</strong> Internal rules approved by EU data protection authorities</li>
              <li><strong>Certification Schemes:</strong> Transfers under approved certification mechanisms</li>
            </ul>

            <h2>Data Protection Officer</h2>
            
            <p>We have appointed a Data Protection Officer (DPO) to oversee our data protection activities and serve as your point of contact for GDPR-related matters.</p>
            
            <p><strong>Contact our DPO:</strong></p>
            <ul>
              <li><strong>Email:</strong> dpo@universalblog.com</li>
              <li><strong>Address:</strong> Data Protection Officer, Universal Blog Platform, 123 Privacy Street, San Francisco, CA 94105</li>
            </ul>

            <h2>How to Exercise Your Rights</h2>
            
            <h3>Online Portal</h3>
            <p>Use our self-service portal to exercise most of your rights instantly:</p>
            <ul>
              <li>Access and download your data</li>
              <li>Update your information</li>
              <li>Manage consent preferences</li>
              <li>Request data deletion</li>
            </ul>

            <h3>Contact Us</h3>
            <p>For complex requests or if you need assistance, contact us directly:</p>
            <ul>
              <li><strong>Email:</strong> gdpr@universalblog.com</li>
              <li><strong>Subject Line:</strong> "GDPR Request - [Type of Request]"</li>
              <li><strong>Include:</strong> Your full name, email address, and specific request details</li>
            </ul>

            <h3>Verification Process</h3>
            <p>To protect your privacy, we may need to verify your identity before processing requests. This may involve:</p>
            <ul>
              <li>Confirming your email address</li>
              <li>Answering security questions</li>
              <li>Providing additional identification documents</li>
            </ul>

            <h2>Response Timeframes</h2>
            
            <ul>
              <li><strong>Standard Requests:</strong> We respond within 30 days</li>
              <li><strong>Complex Requests:</strong> May require up to 60 days (we'll notify you of any extension)</li>
              <li><strong>Urgent Requests:</strong> Security-related requests are prioritized</li>
              <li><strong>Automated Responses:</strong> Some requests can be fulfilled immediately through our portal</li>
            </ul>

            <h2>Complaints and Supervisory Authority</h2>
            
            <p>If you're not satisfied with how we handle your personal data or GDPR request, you have the right to lodge a complaint with a supervisory authority.</p>

            <h3>EU Supervisory Authorities</h3>
            <p>You can contact your local data protection authority or our lead supervisory authority:</p>
            <ul>
              <li><strong>Ireland:</strong> Data Protection Commission (DPC)</li>
              <li><strong>Website:</strong> <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">www.dataprotection.ie</a></li>
              <li><strong>Phone:</strong> +353 57 868 4800</li>
            </ul>

            <h2>Updates to GDPR Compliance</h2>
            
            <p>We regularly review and update our GDPR compliance measures. Changes may include:</p>
            <ul>
              <li>Updates to data processing activities</li>
              <li>New safeguards for international transfers</li>
              <li>Enhanced rights management tools</li>
              <li>Improved transparency measures</li>
            </ul>

            <p>We'll notify you of significant changes through email or platform notifications.</p>
          </div>

          {/* CTA Section */}
          <Card className="mt-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Exercise Your Rights</CardTitle>
              <CardDescription>
                Ready to manage your personal data? Use our self-service portal or contact us directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/gdpr/request">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit GDPR Request
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="mailto:gdpr@universalblog.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact DPO
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
