import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Mail,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Reports Guide',
  description: 'Create and customize detailed reports to track your content performance and ROI.',
}

const reportTypes = [
  {
    icon: BarChart3,
    title: 'Performance Reports',
    description: 'Track engagement, reach, and conversion metrics',
    includes: ['Engagement rates by platform', 'Reach and impressions', 'Click-through rates', 'Top performing content']
  },
  {
    icon: Calendar,
    title: 'Time-based Reports',
    description: 'Analyze performance over specific time periods',
    includes: ['Daily/weekly/monthly summaries', 'Seasonal trends', 'Growth over time', 'Optimal posting times']
  },
  {
    icon: FileText,
    title: 'Content Reports',
    description: 'Detailed analysis of your content strategy',
    includes: ['Content type performance', 'Hashtag effectiveness', 'Topic analysis', 'Content gaps']
  }
]

export default function ReportsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Custom Reports Guide"
        description="Create detailed reports to track performance, measure ROI, and optimize your content strategy."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Builder
              </CardTitle>
              <CardDescription>
                Create custom reports tailored to your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Report Types</h2>
            <div className="space-y-8">
              {reportTypes.map((report, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <report.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3">Includes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {report.includes.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Features */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Report Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Download className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Multiple Formats</h3>
                  <p className="text-sm text-muted-foreground">Export as PDF, Excel, CSV, or PowerPoint</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Scheduled Delivery</h3>
                  <p className="text-sm text-muted-foreground">Automatically email reports on schedule</p>
                </div>
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Custom Branding</h3>
                  <p className="text-sm text-muted-foreground">Add your logo and brand colors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Creating Reports</h2>
            <p className="text-muted-foreground mb-6">
              Build custom reports to track your content performance and ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Create Custom Report
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/analytics">
                  View Analytics Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
