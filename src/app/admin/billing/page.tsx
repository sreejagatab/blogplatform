import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Billing & Subscription - Admin',
  description: 'Manage your subscription, billing, and payment information.',
}

export default function BillingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Billing & Subscription"
        description="Manage your subscription plan, billing information, and payment methods."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Current Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your active subscription and usage details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-purple-600 text-white">Pro Plan</Badge>
                    <span className="text-2xl font-bold">$49/month</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Next billing date:</span>
                      <span className="font-medium">January 15, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing cycle:</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan status:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Plan Features</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unlimited posts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      10 team members
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    Change Plan
                  </Link>
                </Button>
                <Button variant="outline">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>
                Current month usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Posts Published</span>
                    <span className="text-sm text-muted-foreground">47 / Unlimited</span>
                  </div>
                  <Progress value={47} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Team Members</span>
                    <span className="text-sm text-muted-foreground">5 / 10</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Requests</span>
                    <span className="text-sm text-muted-foreground">8,247 / 100,000</span>
                  </div>
                  <Progress value={8.2} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage Used</span>
                    <span className="text-sm text-muted-foreground">2.3 GB / 100 GB</span>
                  </div>
                  <Progress value={2.3} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/billing/payment">
                    Update
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Billing History
                  </CardTitle>
                  <CardDescription>
                    Recent invoices and payments
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/billing/invoices">
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">December 2024</p>
                    <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$49.00</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">Paid</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">November 2024</p>
                    <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$49.00</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">Paid</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Billing Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage billing preferences and notifications
                </p>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Team Billing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage team member billing access
                </p>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Tax Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update tax details and compliance info
                </p>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
