import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Webhook, 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Settings
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Webhooks - Admin',
  description: 'Manage webhook endpoints for real-time event notifications.',
}

const webhooks = [
  {
    id: '1',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    events: ['post.published', 'workflow.completed'],
    status: 'active',
    lastDelivery: '2 minutes ago',
    successRate: 98.5,
    totalDeliveries: 1247
  },
  {
    id: '2',
    name: 'Analytics Webhook',
    url: 'https://analytics.mycompany.com/webhooks/universalblog',
    events: ['post.published', 'analytics.updated'],
    status: 'active',
    lastDelivery: '1 hour ago',
    successRate: 100,
    totalDeliveries: 892
  },
  {
    id: '3',
    name: 'Development Testing',
    url: 'https://webhook.site/unique-id',
    events: ['post.created', 'post.updated', 'post.deleted'],
    status: 'paused',
    lastDelivery: '3 days ago',
    successRate: 85.2,
    totalDeliveries: 156
  }
]

const availableEvents = [
  'post.created',
  'post.published',
  'post.updated',
  'post.deleted',
  'analytics.updated',
  'user.invited',
  'workflow.completed',
  'integration.connected'
]

export default function WebhooksPage() {
  return (
    <PageLayout>
      <PageHero
        title="Webhooks"
        description="Configure webhook endpoints to receive real-time notifications about events in your account."
        size="sm"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Create New Webhook */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Webhook
              </CardTitle>
              <CardDescription>
                Add a new webhook endpoint to receive event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookName">Webhook Name</Label>
                    <Input 
                      id="webhookName" 
                      placeholder="e.g., Slack Notifications"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Endpoint URL</Label>
                    <Input 
                      id="webhookUrl" 
                      placeholder="https://your-app.com/webhooks"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableEvents.map((event, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="checkbox" id={event} className="rounded" />
                        <Label htmlFor={event} className="text-sm font-mono">
                          {event}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button>
                  <Webhook className="mr-2 h-4 w-4" />
                  Create Webhook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                Manage your existing webhook endpoints and monitor their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                            {webhook.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm text-muted-foreground">Endpoint URL:</Label>
                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                              {webhook.url}
                            </p>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-muted-foreground">Subscribed Events:</Label>
                            <div className="flex gap-1 mt-1">
                              {webhook.events.map((event, index) => (
                                <Badge key={index} variant="outline" className="text-xs font-mono">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Last delivery: {webhook.lastDelivery}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              <span>Success rate: {webhook.successRate}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Total deliveries: {webhook.totalDeliveries}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        {webhook.status === 'active' ? (
                          <Button variant="ghost" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Logs */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>
                Monitor webhook delivery status and debug issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">post.published</p>
                      <p className="text-xs text-muted-foreground">Slack Notifications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">200 OK</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">analytics.updated</p>
                      <p className="text-xs text-muted-foreground">Analytics Webhook</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">200 OK</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">workflow.completed</p>
                      <p className="text-xs text-muted-foreground">Development Testing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">404 Not Found</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Button variant="outline">
                  View All Delivery Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Test Your Webhooks</CardTitle>
              <CardDescription className="text-blue-700">
                Send test events to verify your webhook endpoints are working correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  Send Test Event
                </Button>
                <p className="text-sm text-blue-800">
                  We'll send a sample post.published event to all active webhooks
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
