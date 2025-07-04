import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  Shield, 
  Bell,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Account Setup Guide',
  description: 'Complete guide to setting up your Universal Blog Platform account with all essential configurations.',
}

const setupSteps = [
  {
    icon: User,
    title: 'Complete Your Profile',
    description: 'Add your personal information and profile picture',
    tasks: [
      'Upload a professional profile picture',
      'Add your bio and description',
      'Set your display name and username',
      'Add your website and social links'
    ],
    time: '5 minutes'
  },
  {
    icon: Shield,
    title: 'Security Settings',
    description: 'Secure your account with proper authentication',
    tasks: [
      'Enable two-factor authentication',
      'Set a strong password',
      'Review login sessions',
      'Configure backup email'
    ],
    time: '10 minutes'
  },
  {
    icon: Bell,
    title: 'Notification Preferences',
    description: 'Choose how and when you want to be notified',
    tasks: [
      'Set email notification preferences',
      'Configure push notifications',
      'Choose digest frequency',
      'Set up mobile alerts'
    ],
    time: '5 minutes'
  },
  {
    icon: Settings,
    title: 'Platform Preferences',
    description: 'Customize your content creation experience',
    tasks: [
      'Set default content settings',
      'Choose your timezone',
      'Configure language preferences',
      'Set up content templates'
    ],
    time: '10 minutes'
  }
]

export default function AccountSetupPage() {
  return (
    <PageLayout>
      <PageHero
        title="Account Setup Guide"
        description="Get your Universal Blog Platform account configured properly for the best experience."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Complete Account Setup</CardTitle>
              <CardDescription>
                Follow these steps to fully configure your account and unlock all features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Estimated time: 30 minutes</p>
                  <p className="text-sm text-blue-700">Complete all steps for the best experience</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Steps */}
          <div className="space-y-8">
            {setupSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < setupSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-24 bg-border" />
                )}
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <step.icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <Badge variant="outline">{step.time}</Badge>
                        </div>
                        <CardDescription className="text-base">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-4">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{task}</span>
                            </li>
                          ))}
                        </ul>
                        <Button variant="outline" size="sm">
                          Configure Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-16">
            <CardHeader>
              <CardTitle>Quick Setup Actions</CardTitle>
              <CardDescription>
                Essential settings you can configure right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm">Edit Profile</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">Security</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span className="text-sm">Notifications</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Preferences</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Ready for the Next Step?</h2>
            <p className="text-muted-foreground mb-6">
              Once your account is set up, learn how to connect your platforms and create your first post.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/platform-connections">
                  Connect Platforms
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/first-post">Create First Post</Link>
              </Button>
            </div>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
