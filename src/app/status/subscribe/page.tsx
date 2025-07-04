import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Mail, 
  Smartphone,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscribe to Status Updates',
  description: 'Get notified about system status, maintenance, and service updates.',
}

export default function StatusSubscribePage() {
  return (
    <PageLayout>
      <PageHero
        title="Subscribe to Status Updates"
        description="Stay informed about system status, planned maintenance, and service updates."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-2xl mx-auto">
          {/* Subscription Form */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive status updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="pl-10" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Notification Types</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="incidents">Service Incidents</Label>
                    <p className="text-sm text-muted-foreground">Get notified when services are down or degraded</p>
                  </div>
                  <Switch id="incidents" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Planned Maintenance</Label>
                    <p className="text-sm text-muted-foreground">Advance notice of scheduled maintenance</p>
                  </div>
                  <Switch id="maintenance" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="updates">Service Updates</Label>
                    <p className="text-sm text-muted-foreground">New features and improvements</p>
                  </div>
                  <Switch id="updates" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="resolved">Issue Resolutions</Label>
                    <p className="text-sm text-muted-foreground">When incidents are resolved</p>
                  </div>
                  <Switch id="resolved" defaultChecked />
                </div>
              </div>

              <Button size="lg" className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Subscribe to Updates
              </Button>
            </CardContent>
          </Card>

          {/* What You'll Receive */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What You'll Receive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Real-time Incident Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Immediate notifications when service issues occur
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Maintenance Schedules</h3>
                    <p className="text-sm text-muted-foreground">
                      Advance notice of planned maintenance windows
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Resolution Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Confirmation when issues are resolved
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Service Improvements</h3>
                    <p className="text-sm text-muted-foreground">
                      Updates about new features and enhancements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Methods */}
          <Card className="mb-12 bg-muted/30">
            <CardHeader>
              <CardTitle>Other Ways to Stay Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg bg-white">
                  <Smartphone className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Mobile App</h3>
                  <p className="text-sm text-muted-foreground">Get push notifications on your mobile device</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-white">
                  <Bell className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">RSS Feed</h3>
                  <p className="text-sm text-muted-foreground">Subscribe to our status page RSS feed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Status */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Want to check current system status?
            </p>
            <Button variant="outline" asChild>
              <Link href="/status">
                View Status Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
