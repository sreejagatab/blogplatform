import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Search,
  Calendar,
  DollarSign,
  Filter
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Invoices - Admin',
  description: 'View and download your billing invoices and payment history.',
}

const invoices = [
  {
    id: 'INV-2024-12-001',
    date: '2024-12-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Dec 15, 2024 - Jan 15, 2025'
  },
  {
    id: 'INV-2024-11-001',
    date: '2024-11-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Nov 15, 2024 - Dec 15, 2024'
  },
  {
    id: 'INV-2024-10-001',
    date: '2024-10-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Oct 15, 2024 - Nov 15, 2024'
  },
  {
    id: 'INV-2024-09-001',
    date: '2024-09-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Sep 15, 2024 - Oct 15, 2024'
  },
  {
    id: 'INV-2024-08-001',
    date: '2024-08-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Aug 15, 2024 - Sep 15, 2024'
  },
  {
    id: 'INV-2024-07-001',
    date: '2024-07-15',
    amount: 49.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    period: 'Jul 15, 2024 - Aug 15, 2024'
  }
]

export default function InvoicesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Billing Invoices"
        description="View, download, and manage your billing invoices and payment history."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/admin/billing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Billing
              </Link>
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-sm text-muted-foreground">Total Invoices</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">${invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Paid</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Months Active</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search invoices..."
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices List */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                All your billing invoices and payment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{invoice.id}</h3>
                        <Badge variant="outline" className="text-green-600">
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {invoice.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Billing period: {invoice.period}</span>
                        <span>Date: {new Date(invoice.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">USD</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details Modal Trigger */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Need Help with Invoices?</CardTitle>
              <CardDescription className="text-blue-700">
                Questions about your billing or need assistance with invoices?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                  <Link href="/help/billing">
                    Billing Help Center
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:billing@universalblog.com">
                    Contact Billing Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
