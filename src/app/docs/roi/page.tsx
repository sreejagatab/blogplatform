import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3, 
  Calculator,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ROI Tracking - Documentation',
  description: 'Learn how to track and measure the return on investment of your content marketing efforts.',
}

const roiMetrics = [
  {
    name: 'Content ROI',
    formula: '(Revenue - Content Costs) / Content Costs × 100',
    description: 'Measures the direct return from content marketing investments',
    example: '($50,000 - $10,000) / $10,000 × 100 = 400% ROI'
  },
  {
    name: 'Cost Per Lead (CPL)',
    formula: 'Total Content Costs / Number of Leads Generated',
    description: 'Shows how much you spend to acquire each lead through content',
    example: '$10,000 / 500 leads = $20 per lead'
  },
  {
    name: 'Customer Acquisition Cost (CAC)',
    formula: 'Total Marketing Costs / Number of New Customers',
    description: 'Calculates the cost to acquire each new customer',
    example: '$15,000 / 100 customers = $150 per customer'
  },
  {
    name: 'Lifetime Value to CAC Ratio',
    formula: 'Customer Lifetime Value / Customer Acquisition Cost',
    description: 'Compares long-term customer value to acquisition cost',
    example: '$1,500 LTV / $150 CAC = 10:1 ratio'
  }
]

const trackingSteps = [
  {
    step: 1,
    title: 'Set Clear Objectives',
    description: 'Define specific, measurable goals for your content marketing',
    actions: [
      'Identify primary business objectives',
      'Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)',
      'Align content goals with business outcomes',
      'Establish baseline metrics'
    ]
  },
  {
    step: 2,
    title: 'Implement Tracking Systems',
    description: 'Set up tools and systems to capture relevant data',
    actions: [
      'Configure Google Analytics with goal tracking',
      'Set up UTM parameters for content campaigns',
      'Implement conversion tracking pixels',
      'Connect CRM systems for lead attribution'
    ]
  },
  {
    step: 3,
    title: 'Calculate Content Costs',
    description: 'Accurately track all costs associated with content creation',
    actions: [
      'Track content creation time and labor costs',
      'Include tool and software subscriptions',
      'Account for promotion and distribution costs',
      'Factor in overhead and indirect costs'
    ]
  },
  {
    step: 4,
    title: 'Measure Revenue Attribution',
    description: 'Connect content performance to actual revenue generation',
    actions: [
      'Track leads generated from each content piece',
      'Monitor conversion rates through the sales funnel',
      'Calculate revenue from content-attributed customers',
      'Use multi-touch attribution models'
    ]
  }
]

const bestPractices = [
  {
    title: 'Use Attribution Models',
    description: 'Implement first-touch, last-touch, and multi-touch attribution to understand the full customer journey.',
    icon: Target
  },
  {
    title: 'Track Long-term Value',
    description: 'Consider customer lifetime value, not just immediate conversions, for accurate ROI calculation.',
    icon: TrendingUp
  },
  {
    title: 'Segment Your Analysis',
    description: 'Break down ROI by content type, channel, audience segment, and campaign for deeper insights.',
    icon: BarChart3
  },
  {
    title: 'Regular Reporting',
    description: 'Create automated reports and dashboards for consistent ROI monitoring and optimization.',
    icon: Calculator
  }
]

export default function ROITrackingPage() {
  return (
    <PageLayout>
      <PageHero
        title="ROI Tracking"
        description="Master the art of measuring and optimizing your content marketing return on investment."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Why Track Content ROI?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Tracking return on investment (ROI) for your content marketing efforts is crucial for 
                understanding what works, optimizing your strategy, and proving the value of your content 
                to stakeholders. Our platform provides comprehensive tools to measure and analyze your 
                content performance across all channels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Optimize Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify top-performing content and replicate success
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Justify Investment</h3>
                  <p className="text-sm text-muted-foreground">
                    Demonstrate clear value to stakeholders and secure budget
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Strategic Decisions</h3>
                  <p className="text-sm text-muted-foreground">
                    Make data-driven decisions about content strategy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key ROI Metrics */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Key ROI Metrics</h2>
            <div className="space-y-6">
              {roiMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{metric.name}</CardTitle>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">Formula:</h4>
                      <code className="text-sm bg-background p-2 rounded border">
                        {metric.formula}
                      </code>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-800">Example:</h4>
                      <p className="text-sm text-green-700">{metric.example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ROI Tracking Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">ROI Tracking Process</h2>
            <div className="space-y-8">
              {trackingSteps.map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div>
                        <CardTitle>{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <practice.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{practice.title}</h3>
                        <p className="text-sm text-muted-foreground">{practice.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Challenges */}
          <Card className="mb-12 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertCircle className="h-5 w-5" />
                Common ROI Tracking Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-orange-800">
                <div>
                  <h4 className="font-semibold mb-2">Attribution Complexity</h4>
                  <p className="text-sm">
                    Customers often interact with multiple content pieces before converting. 
                    Use multi-touch attribution models to get a complete picture.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Long Sales Cycles</h4>
                  <p className="text-sm">
                    B2B sales cycles can span months. Track leading indicators and use 
                    cohort analysis to measure long-term impact.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Indirect Value</h4>
                  <p className="text-sm">
                    Content provides brand awareness and thought leadership value that's 
                    hard to quantify. Include qualitative metrics alongside quantitative ones.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Features */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                Universal Blog Platform ROI Features
              </CardTitle>
              <CardDescription>
                Built-in tools to simplify your ROI tracking and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Automated Tracking</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• UTM parameter generation and tracking</li>
                    <li>• Conversion pixel implementation</li>
                    <li>• Cross-platform attribution</li>
                    <li>• Revenue tracking integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Advanced Analytics</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• ROI calculation dashboards</li>
                    <li>• Custom attribution models</li>
                    <li>• Cohort analysis tools</li>
                    <li>• Predictive ROI modeling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Tracking Your Content ROI</h2>
            <p className="text-muted-foreground mb-6">
              Set up comprehensive ROI tracking to optimize your content strategy and prove its value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/analytics/roi">
                  <Calculator className="mr-2 h-4 w-4" />
                  Open ROI Dashboard
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
