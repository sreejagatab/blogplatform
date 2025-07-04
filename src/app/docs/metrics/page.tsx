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
  Eye,
  Heart,
  ArrowRight,
  Target,
  Users,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understanding Key Metrics',
  description: 'Learn about the most important metrics to track for content success and business growth.',
}

const metricCategories = [
  {
    category: 'Engagement Metrics',
    icon: Heart,
    description: 'Measure how your audience interacts with your content',
    metrics: [
      { name: 'Likes/Reactions', description: 'Basic engagement indicator', benchmark: 'Varies by platform' },
      { name: 'Comments', description: 'Deep engagement and conversation', benchmark: '2-5% of views' },
      { name: 'Shares/Retweets', description: 'Content amplification by audience', benchmark: '1-3% of views' },
      { name: 'Saves/Bookmarks', description: 'Content value and utility', benchmark: '5-10% of likes' }
    ]
  },
  {
    category: 'Reach Metrics',
    icon: Eye,
    description: 'Track how many people see your content',
    metrics: [
      { name: 'Impressions', description: 'Total times content was displayed', benchmark: 'Platform dependent' },
      { name: 'Reach', description: 'Unique users who saw content', benchmark: '10-30% of followers' },
      { name: 'Views', description: 'Content consumption metric', benchmark: 'Varies by format' },
      { name: 'Click-through Rate', description: 'Link clicks vs impressions', benchmark: '0.5-2%' }
    ]
  },
  {
    category: 'Growth Metrics',
    icon: TrendingUp,
    description: 'Monitor audience and business growth',
    metrics: [
      { name: 'Follower Growth', description: 'New followers over time', benchmark: '2-5% monthly' },
      { name: 'Engagement Rate', description: 'Engagement vs reach ratio', benchmark: '1-6%' },
      { name: 'Website Traffic', description: 'Visitors from social content', benchmark: 'Varies by goals' },
      { name: 'Email Signups', description: 'List building effectiveness', benchmark: '1-3% of traffic' }
    ]
  },
  {
    category: 'Business Metrics',
    icon: DollarSign,
    description: 'Measure revenue and business impact',
    metrics: [
      { name: 'Conversion Rate', description: 'Actions taken vs visitors', benchmark: '1-3%' },
      { name: 'Revenue per Post', description: 'Direct revenue attribution', benchmark: 'Goal dependent' },
      { name: 'Customer Acquisition Cost', description: 'Cost to acquire customers', benchmark: 'Industry specific' },
      { name: 'Lifetime Value', description: 'Total customer value', benchmark: '3x acquisition cost' }
    ]
  }
]

export default function MetricsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Understanding Key Metrics"
        description="Master the metrics that matter most for content success and business growth."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Overview */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Metrics Dashboard
              </CardTitle>
              <CardDescription>
                Track the metrics that drive your content success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">4</div>
                  <p className="text-sm text-muted-foreground">Metric Categories</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">16</div>
                  <p className="text-sm text-muted-foreground">Key Metrics</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Real-time</div>
                  <p className="text-sm text-muted-foreground">Data Updates</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Custom</div>
                  <p className="text-sm text-muted-foreground">Dashboards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metric Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Key Metric Categories</h2>
            <div className="space-y-8">
              {metricCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.category}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{metric.name}</h3>
                            <Badge variant="outline">{metric.benchmark}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Metric Formulas */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Important Metric Formulas</CardTitle>
              <CardDescription>
                How to calculate key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Engagement Rate</h3>
                  <code className="block p-3 bg-black text-green-400 rounded text-sm">
                    (Likes + Comments + Shares) ÷ Reach × 100
                  </code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Click-through Rate (CTR)</h3>
                  <code className="block p-3 bg-black text-green-400 rounded text-sm">
                    Clicks ÷ Impressions × 100
                  </code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Conversion Rate</h3>
                  <code className="block p-3 bg-black text-green-400 rounded text-sm">
                    Conversions ÷ Total Visitors × 100
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Metrics Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Focus on metrics that align with your goals</li>
                    <li>• Track trends over time, not just snapshots</li>
                    <li>• Compare performance across platforms</li>
                    <li>• Set realistic benchmarks for your niche</li>
                    <li>• Use metrics to inform content strategy</li>
                    <li>• Monitor both vanity and business metrics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Obsess over vanity metrics only</li>
                    <li>• Compare your metrics to others without context</li>
                    <li>• Make decisions based on single data points</li>
                    <li>• Ignore platform-specific differences</li>
                    <li>• Track too many metrics at once</li>
                    <li>• Forget to act on insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Tracking Your Metrics</h2>
            <p className="text-muted-foreground mb-6">
              Use our analytics dashboard to monitor all your key metrics in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics Dashboard
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/analytics">
                  Learn About Analytics
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
