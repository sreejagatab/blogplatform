import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Activity,
  PieChart,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Team Analytics - Documentation',
  description: 'Learn how to track team performance, productivity, and collaboration metrics to optimize your content team.',
}

const analyticsCategories = [
  {
    title: 'Productivity Metrics',
    description: 'Track individual and team content creation productivity',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800',
    metrics: [
      'Content pieces created per team member',
      'Average time to complete content',
      'Publishing frequency and consistency',
      'Content quality scores and ratings'
    ]
  },
  {
    title: 'Collaboration Insights',
    description: 'Understand how your team works together on content',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    metrics: [
      'Review and approval turnaround times',
      'Number of revisions per content piece',
      'Cross-team collaboration frequency',
      'Workflow bottleneck identification'
    ]
  },
  {
    title: 'Performance Analytics',
    description: 'Measure the impact and effectiveness of team content',
    icon: Target,
    color: 'bg-purple-100 text-purple-800',
    metrics: [
      'Content engagement rates by author',
      'Conversion rates from team content',
      'Social media performance by creator',
      'SEO performance and rankings'
    ]
  },
  {
    title: 'Workload Distribution',
    description: 'Ensure balanced workloads and identify capacity issues',
    icon: BarChart3,
    color: 'bg-orange-100 text-orange-800',
    metrics: [
      'Content assignments per team member',
      'Workload balance across the team',
      'Peak productivity times and patterns',
      'Resource utilization and capacity'
    ]
  }
]

const reportTypes = [
  {
    name: 'Individual Performance Report',
    description: 'Detailed analytics for each team member',
    frequency: 'Weekly/Monthly',
    includes: [
      'Content creation volume and quality',
      'Engagement metrics for published content',
      'Collaboration and review participation',
      'Goal achievement and KPI tracking'
    ]
  },
  {
    name: 'Team Productivity Dashboard',
    description: 'Overall team performance and efficiency metrics',
    frequency: 'Real-time/Daily',
    includes: [
      'Team-wide content output and velocity',
      'Workflow efficiency and bottlenecks',
      'Collaboration patterns and trends',
      'Resource allocation and utilization'
    ]
  },
  {
    name: 'Content Performance Analysis',
    description: 'How team-created content performs across platforms',
    frequency: 'Weekly/Monthly',
    includes: [
      'Engagement rates by content creator',
      'Platform-specific performance metrics',
      'Content type effectiveness analysis',
      'ROI attribution by team member'
    ]
  },
  {
    name: 'Workflow Efficiency Report',
    description: 'Analysis of content creation and approval processes',
    frequency: 'Monthly/Quarterly',
    includes: [
      'Average time in each workflow stage',
      'Approval and revision cycle analysis',
      'Process bottleneck identification',
      'Workflow optimization recommendations'
    ]
  }
]

const keyMetrics = [
  {
    metric: 'Content Velocity',
    description: 'Average number of content pieces completed per team member per week',
    icon: Activity,
    benchmark: '3-5 pieces per week per creator'
  },
  {
    metric: 'Review Turnaround',
    description: 'Average time from content submission to approval',
    icon: Clock,
    benchmark: '24-48 hours for standard content'
  },
  {
    metric: 'Quality Score',
    description: 'Average quality rating based on engagement and performance',
    icon: Award,
    benchmark: '4.0+ out of 5.0 rating scale'
  },
  {
    metric: 'Collaboration Index',
    description: 'Frequency of cross-team collaboration and knowledge sharing',
    icon: Users,
    benchmark: '2-3 collaborative projects per month'
  }
]

export default function TeamAnalyticsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Team Analytics"
        description="Gain insights into your team's productivity, collaboration, and content performance to optimize workflows and drive results."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Why Track Team Analytics?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Team analytics provide valuable insights into how your content team performs, collaborates, 
                and contributes to business goals. By tracking key metrics, you can identify top performers, 
                optimize workflows, and ensure balanced workloads across your team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Optimize Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify what works and replicate successful strategies
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Improve Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand team dynamics and enhance cooperation
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Achieve Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Track progress toward team and individual objectives
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Analytics Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analyticsCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${category.color}`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.metrics.map((metric, metricIndex) => (
                        <li key={metricIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Key Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyMetrics.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{item.metric}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="bg-muted/50 p-2 rounded text-xs">
                          <strong>Benchmark:</strong> {item.benchmark}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Report Types */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Available Reports</h2>
            <div className="space-y-6">
              {reportTypes.map((report, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{report.name}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{report.frequency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold mb-3">Includes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {report.includes.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Analytics Features */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-6 w-6" />
                Team Analytics Features
              </CardTitle>
              <CardDescription>
                Comprehensive tools for tracking and analyzing team performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Real-time Dashboards</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Live team productivity metrics</li>
                    <li>• Individual performance tracking</li>
                    <li>• Workflow status visualization</li>
                    <li>• Goal progress monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Advanced Analytics</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Trend analysis and forecasting</li>
                    <li>• Comparative performance reports</li>
                    <li>• Custom metric creation</li>
                    <li>• Automated insights and recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Collaboration Insights</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Team interaction patterns</li>
                    <li>• Review and feedback cycles</li>
                    <li>• Knowledge sharing metrics</li>
                    <li>• Cross-functional project tracking</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Performance Management</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Individual goal setting and tracking</li>
                    <li>• Performance review preparation</li>
                    <li>• Skill development recommendations</li>
                    <li>• Recognition and achievement tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Team Analytics Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-blue-800">
                <div>
                  <h4 className="font-semibold mb-2">Focus on Actionable Metrics</h4>
                  <p className="text-sm">
                    Track metrics that can directly inform decisions and improvements, not just vanity numbers.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Regular Team Reviews</h4>
                  <p className="text-sm">
                    Schedule regular team meetings to discuss analytics insights and identify improvement opportunities.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Individual Privacy</h4>
                  <p className="text-sm">
                    Be transparent about what metrics are tracked and ensure individual data is used constructively.
                  </p>
                </div>
                <Separator className="bg-blue-200" />
                <div>
                  <h4 className="font-semibold mb-2">Continuous Improvement</h4>
                  <p className="text-sm">
                    Use analytics to identify trends and make data-driven decisions about team processes and goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Tracking Team Performance</h2>
            <p className="text-muted-foreground mb-6">
              Set up team analytics to gain insights into productivity, collaboration, and content performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/analytics/team">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Team Analytics
                </Link>
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
