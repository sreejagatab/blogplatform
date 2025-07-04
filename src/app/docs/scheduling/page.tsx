import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  Calendar, 
  Globe,
  Target,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Content Scheduling Guide',
  description: 'Master content scheduling to reach your audience at optimal times across all platforms.',
}

const schedulingFeatures = [
  {
    icon: Clock,
    title: 'Optimal Timing',
    description: 'AI-powered recommendations for best posting times',
    benefits: ['Increased engagement', 'Better reach', 'Higher conversion rates']
  },
  {
    icon: Calendar,
    title: 'Content Calendar',
    description: 'Visual calendar to plan and organize your content',
    benefits: ['Better planning', 'Consistent posting', 'Content gaps visibility']
  },
  {
    icon: Globe,
    title: 'Timezone Management',
    description: 'Schedule for different timezones automatically',
    benefits: ['Global reach', 'Local relevance', 'Audience optimization']
  },
  {
    icon: Target,
    title: 'Platform Optimization',
    description: 'Different schedules for different platforms',
    benefits: ['Platform-specific timing', 'Audience behavior matching', 'Maximum impact']
  }
]

const bestTimes = [
  {
    platform: 'Twitter/X',
    weekdays: '9 AM - 10 AM, 7 PM - 9 PM',
    weekends: '9 AM - 10 AM',
    timezone: 'EST',
    notes: 'Higher engagement during commute times'
  },
  {
    platform: 'LinkedIn',
    weekdays: '8 AM - 10 AM, 12 PM - 2 PM',
    weekends: 'Limited activity',
    timezone: 'EST',
    notes: 'Business hours perform best'
  },
  {
    platform: 'Instagram',
    weekdays: '11 AM - 1 PM, 7 PM - 9 PM',
    weekends: '10 AM - 12 PM',
    timezone: 'EST',
    notes: 'Visual content peaks during breaks'
  },
  {
    platform: 'Facebook',
    weekdays: '1 PM - 3 PM, 7 PM - 9 PM',
    weekends: '12 PM - 2 PM',
    timezone: 'EST',
    notes: 'Afternoon and evening engagement'
  }
]

export default function SchedulingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Content Scheduling Guide"
        description="Learn how to schedule your content for maximum reach and engagement across all platforms."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Schedule Setup
              </CardTitle>
              <CardDescription>
                Get started with content scheduling in just a few clicks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/admin/scheduler/calendar">
                    <Calendar className="mr-2 h-4 w-4" />
                    Open Content Calendar
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/admin/scheduler/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Auto-Schedule
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Scheduling Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {schedulingFeatures.map((feature, index) => (
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
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Posting Times */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Optimal Posting Times</h2>
            <Card>
              <CardHeader>
                <CardTitle>Platform-Specific Best Times</CardTitle>
                <CardDescription>
                  General guidelines for optimal posting times (adjust based on your audience analytics)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {bestTimes.map((time, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{time.platform}</h3>
                        <Badge variant="outline">{time.timezone}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Weekdays:</p>
                          <p className="text-muted-foreground">{time.weekdays}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Weekends:</p>
                          <p className="text-muted-foreground">{time.weekends}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Notes:</p>
                          <p className="text-muted-foreground">{time.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to Schedule */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>How to Schedule Content</CardTitle>
              <CardDescription>
                Step-by-step guide to scheduling your content effectively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Create Content</h3>
                  <p className="text-sm text-muted-foreground">Write your post and add any media or formatting</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Choose Platforms</h3>
                  <p className="text-sm text-muted-foreground">Select which platforms to publish to</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Set Schedule</h3>
                  <p className="text-sm text-muted-foreground">Pick date, time, and timezone for publishing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Monitor & Engage</h3>
                  <p className="text-sm text-muted-foreground">Track performance and engage with responses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Scheduling */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Advanced Scheduling Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Bulk Scheduling</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Schedule multiple posts at once</li>
                    <li>• Import content from CSV files</li>
                    <li>• Set up recurring post schedules</li>
                    <li>• Batch edit scheduled content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Smart Scheduling</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• AI-powered optimal time suggestions</li>
                    <li>• Audience activity analysis</li>
                    <li>• Automatic timezone adjustments</li>
                    <li>• Performance-based recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Scheduling Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Analyze your audience's active hours</li>
                    <li>• Test different posting times</li>
                    <li>• Consider platform-specific peak times</li>
                    <li>• Schedule consistently</li>
                    <li>• Plan content in advance</li>
                    <li>• Monitor scheduled post performance</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Schedule too many posts at once</li>
                    <li>• Ignore timezone differences</li>
                    <li>• Set and forget - monitor engagement</li>
                    <li>• Use the same time for all platforms</li>
                    <li>• Schedule during platform downtime</li>
                    <li>• Forget to engage with responses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Schedule?</h2>
            <p className="text-muted-foreground mb-6">
              Start scheduling your content for optimal reach and engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/scheduler">
                  <Calendar className="mr-2 h-4 w-4" />
                  Open Scheduler
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
