import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Eye,
  ArrowRight,
  Target,
  Calendar,
  Download
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Analytics & Performance Tracking',
  description: 'Learn how to track, analyze, and optimize your content performance across all platforms.',
}

const analyticsFeatures = [
  {
    icon: BarChart3,
    title: 'Performance Metrics',
    description: 'Track engagement, reach, and conversion rates',
    metrics: ['Views & Impressions', 'Likes & Shares', 'Comments & Replies', 'Click-through Rates']
  },
  {
    icon: Users,
    title: 'Audience Insights',
    description: 'Understand your audience demographics and behavior',
    metrics: ['Demographics', 'Geographic Data', 'Activity Patterns', 'Device Usage']
  },
  {
    icon: TrendingUp,
    title: 'Growth Tracking',
    description: 'Monitor follower growth and engagement trends',
    metrics: ['Follower Growth', 'Engagement Rate', 'Reach Expansion', 'Content Performance']
  },
  {
    icon: Target,
    title: 'Platform Comparison',
    description: 'Compare performance across different platforms',
    metrics: ['Cross-platform Metrics', 'ROI Analysis', 'Best Performers', 'Optimization Opportunities']
  }
]

const keyMetrics = [
  {
    metric: 'Engagement Rate',
    description: 'Percentage of audience that interacts with your content',
    formula: '(Likes + Comments + Shares) / Reach × 100',
    benchmark: '1-3% is average, 3-6% is good, 6%+ is excellent'
  },
  {
    metric: 'Reach',
    description: 'Number of unique users who saw your content',
    formula: 'Total unique viewers across all platforms',
    benchmark: 'Varies by follower count and platform algorithm'
  },
  {
    metric: 'Click-through Rate (CTR)',
    description: 'Percentage of people who clicked your links',
    formula: 'Clicks / Impressions × 100',
    benchmark: '0.5-1% is average, 1-2% is good, 2%+ is excellent'
  },
  {
    metric: 'Conversion Rate',
    description: 'Percentage of visitors who completed desired action',
    formula: 'Conversions / Total Visitors × 100',
    benchmark: '1-3% is typical for most industries'
  }
]

export default function AnalyticsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Analytics & Performance Tracking"
        description="Master your content analytics to understand what works and optimize for better results."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Access */}
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Access your performance data and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Analytics Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {analyticsFeatures.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Available Metrics:</h4>
                    <ul className="space-y-1">
                      {feature.metrics.map((metric, metricIndex) => (
                        <li key={metricIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Metrics Explained */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Understanding Key Metrics</h2>
            <div className="space-y-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Formula:</h4>
                        <p className="text-sm bg-muted p-3 rounded font-mono">{metric.formula}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benchmark:</h4>
                        <p className="text-sm text-muted-foreground">{metric.benchmark}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Use Analytics */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>How to Use Analytics Effectively</CardTitle>
              <CardDescription>
                Step-by-step guide to analyzing and acting on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Collect Data</h3>
                  <p className="text-sm text-muted-foreground">Gather performance data from all platforms</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Identify Patterns</h3>
                  <p className="text-sm text-muted-foreground">Look for trends in high and low performing content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Test Hypotheses</h3>
                  <p className="text-sm text-muted-foreground">Experiment with different content strategies</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Optimize & Repeat</h3>
                  <p className="text-sm text-muted-foreground">Apply insights to improve future content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Analytics Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Check analytics regularly (weekly/monthly)</li>
                    <li>• Focus on trends, not single data points</li>
                    <li>• Compare performance across platforms</li>
                    <li>• Set specific, measurable goals</li>
                    <li>• Track both vanity and business metrics</li>
                    <li>• Use data to inform content strategy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Obsess over daily fluctuations</li>
                    <li>• Focus only on follower count</li>
                    <li>• Ignore platform-specific metrics</li>
                    <li>• Make decisions based on limited data</li>
                    <li>• Forget to track conversion metrics</li>
                    <li>• Compare your metrics to others without context</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Reports */}
          <Card className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle>Custom Analytics Reports</CardTitle>
              <CardDescription>
                Create personalized reports for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Scheduled Reports</h3>
                  <p className="text-sm text-muted-foreground">Automatic weekly/monthly reports delivered to your inbox</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Goal Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor progress toward your content and business goals</p>
                </div>
                <div className="text-center">
                  <Download className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Export Options</h3>
                  <p className="text-sm text-muted-foreground">Download data in CSV, PDF, or PowerPoint formats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Analyzing Your Performance</h2>
            <p className="text-muted-foreground mb-6">
              Use analytics to understand your audience and optimize your content strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics Dashboard
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/reports">
                  Learn About Reports
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
