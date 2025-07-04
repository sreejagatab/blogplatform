import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Download, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Billing & Payments Help',
  description: 'Get help with billing, payments, subscriptions, and account management for Universal Blog Platform.',
}

const billingTopics = [
  {
    title: 'Subscription Management',
    description: 'Manage your plan, upgrades, and downgrades',
    icon: RefreshCw,
    articles: [
      {
        title: 'How to upgrade your plan',
        description: 'Step-by-step guide to upgrading your subscription',
        href: '#upgrade-plan'
      },
      {
        title: 'Downgrading your subscription',
        description: 'What happens when you downgrade and how to do it',
        href: '#downgrade-plan'
      },
      {
        title: 'Canceling your subscription',
        description: 'How to cancel and what to expect',
        href: '#cancel-subscription'
      },
      {
        title: 'Reactivating a canceled account',
        description: 'Restore your account after cancellation',
        href: '#reactivate-account'
      }
    ]
  },
  {
    title: 'Payment & Billing',
    description: 'Payment methods, invoices, and billing cycles',
    icon: CreditCard,
    articles: [
      {
        title: 'Updating payment methods',
        description: 'Change your credit card or payment information',
        href: '#update-payment'
      },
      {
        title: 'Understanding your invoice',
        description: 'Breakdown of charges and billing details',
        href: '#understand-invoice'
      },
      {
        title: 'Failed payment recovery',
        description: 'What to do when payments fail',
        href: '#failed-payment'
      },
      {
        title: 'Downloading receipts and invoices',
        description: 'Access your billing history and documents',
        href: '#download-receipts'
      }
    ]
  },
  {
    title: 'Pricing & Plans',
    description: 'Understanding our pricing structure and features',
    icon: DollarSign,
    articles: [
      {
        title: 'Comparing plan features',
        description: 'What\'s included in each subscription tier',
        href: '#compare-plans'
      },
      {
        title: 'Usage limits and overages',
        description: 'Understanding limits and additional charges',
        href: '#usage-limits'
      },
      {
        title: 'Enterprise pricing',
        description: 'Custom pricing for large organizations',
        href: '#enterprise-pricing'
      },
      {
        title: 'Student and nonprofit discounts',
        description: 'Special pricing for eligible organizations',
        href: '#discounts'
      }
    ]
  },
  {
    title: 'Account & Security',
    description: 'Account ownership, security, and compliance',
    icon: Shield,
    articles: [
      {
        title: 'Transferring account ownership',
        description: 'How to change the account owner',
        href: '#transfer-ownership'
      },
      {
        title: 'Team billing and permissions',
        description: 'Managing billing access for team members',
        href: '#team-billing'
      },
      {
        title: 'Tax information and compliance',
        description: 'VAT, sales tax, and tax documentation',
        href: '#tax-info'
      },
      {
        title: 'Data retention after cancellation',
        description: 'What happens to your data when you cancel',
        href: '#data-retention'
      }
    ]
  }
]

const commonIssues = [
  {
    issue: 'Payment Failed',
    description: 'Your payment was declined or failed to process',
    solution: 'Check your payment method details, ensure sufficient funds, and try again. Contact your bank if issues persist.',
    severity: 'high'
  },
  {
    issue: 'Unexpected Charges',
    description: 'You see charges you don\'t recognize on your bill',
    solution: 'Review your usage and plan details. Contact support with your invoice number for clarification.',
    severity: 'medium'
  },
  {
    issue: 'Can\'t Access Billing',
    description: 'Unable to view or manage billing information',
    solution: 'Ensure you have billing permissions. Only account owners and billing managers can access billing.',
    severity: 'medium'
  },
  {
    issue: 'Refund Request',
    description: 'You want to request a refund for your subscription',
    solution: 'Contact support within 30 days of payment. Include your reason and invoice details.',
    severity: 'low'
  }
]

const quickActions = [
  {
    title: 'View Current Plan',
    description: 'See your current subscription and usage',
    icon: Calendar,
    href: '/admin/billing'
  },
  {
    title: 'Update Payment Method',
    description: 'Change your credit card or billing info',
    icon: CreditCard,
    href: '/admin/billing/payment'
  },
  {
    title: 'Download Invoices',
    description: 'Access your billing history',
    icon: Download,
    href: '/admin/billing/invoices'
  },
  {
    title: 'Contact Billing Support',
    description: 'Get help with billing questions',
    icon: HelpCircle,
    href: 'mailto:billing@universalblog.com'
  }
]

export default function BillingHelpPage() {
  return (
    <PageLayout>
      <PageHero
        title="Billing & Payments Help"
        description="Get help with subscriptions, payments, invoices, and account billing questions."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {quickActions.map((action, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={action.href}>
                      Access
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Common Issues */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Common Billing Issues
              </CardTitle>
              <CardDescription>
                Quick solutions to the most common billing problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {commonIssues.map((issue, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        issue.severity === 'high' ? 'bg-red-500' :
                        issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{issue.issue}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm"><strong>Solution:</strong> {issue.solution}</p>
                        </div>
                      </div>
                    </div>
                    {index < commonIssues.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Topics */}
          <div className="space-y-8">
            {billingTopics.map((topic, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <topic.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{topic.title}</CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <h4 className="font-semibold mb-2">{article.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={article.href}>
                            Read More
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Billing Policies */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Billing Policies</CardTitle>
              <CardDescription className="text-blue-700">
                Important information about our billing practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <div>
                  <h4 className="font-semibold mb-2">Billing Cycle</h4>
                  <p className="text-sm">
                    Subscriptions are billed monthly or annually based on your plan. 
                    Billing occurs on the same date each cycle.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Refund Policy</h4>
                  <p className="text-sm">
                    We offer a 30-day money-back guarantee for new subscriptions. 
                    Refunds are prorated for downgrades.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Failed Payments</h4>
                  <p className="text-sm">
                    We'll retry failed payments 3 times over 7 days. After that, 
                    your account may be suspended until payment is resolved.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Data Retention</h4>
                  <p className="text-sm">
                    After cancellation, your data is retained for 90 days to allow 
                    for reactivation. After that, it's permanently deleted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Our billing support team is here to help with any questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Billing Support</h4>
                  <div className="space-y-2 text-sm">
                    <p>📧 billing@universalblog.com</p>
                    <p>📞 +1 (555) 123-4567</p>
                    <p>🕒 Monday - Friday, 9 AM - 6 PM EST</p>
                    <p>⚡ Average response time: 2-4 hours</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Before Contacting Support</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Have your account email ready
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Include relevant invoice numbers
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Describe the issue clearly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Check your spam folder for emails
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild>
                  <a href="mailto:billing@universalblog.com">
                    Contact Billing Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/billing">
                    Manage Billing
                    <ArrowRight className="ml-2 h-4 w-4" />
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
