import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Webhook, 
  Send, 
  Code, 
  Shield, 
  ArrowRight,
  Copy,
  CheckCircle,
  AlertCircle,
  Settings,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Webhooks - Documentation',
  description: 'Learn how to set up and use webhooks to receive real-time notifications about events in Universal Blog Platform.',
}

const webhookEvents = [
  {
    event: 'post.created',
    description: 'Triggered when a new post is created',
    payload: 'Post object with metadata'
  },
  {
    event: 'post.published',
    description: 'Triggered when a post is published to platforms',
    payload: 'Post object with publication details'
  },
  {
    event: 'post.updated',
    description: 'Triggered when an existing post is modified',
    payload: 'Updated post object with changes'
  },
  {
    event: 'post.deleted',
    description: 'Triggered when a post is deleted',
    payload: 'Post ID and deletion timestamp'
  },
  {
    event: 'analytics.updated',
    description: 'Triggered when analytics data is refreshed',
    payload: 'Analytics summary and metrics'
  },
  {
    event: 'user.invited',
    description: 'Triggered when a new team member is invited',
    payload: 'User invitation details'
  },
  {
    event: 'workflow.completed',
    description: 'Triggered when a content workflow is completed',
    payload: 'Workflow status and completion details'
  },
  {
    event: 'integration.connected',
    description: 'Triggered when a new platform integration is added',
    payload: 'Integration details and status'
  }
]

const setupSteps = [
  {
    step: 1,
    title: 'Create Webhook Endpoint',
    description: 'Set up an HTTP endpoint to receive webhook notifications',
    code: `// Express.js example
app.post('/webhooks/universalblog', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;
  
  // Verify webhook signature
  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Unauthorized');
  }
  
  // Process the webhook event
  handleWebhookEvent(payload);
  
  res.status(200).send('OK');
});`
  },
  {
    step: 2,
    title: 'Configure Webhook URL',
    description: 'Add your endpoint URL in the platform dashboard',
    code: `// Webhook configuration
{
  "url": "https://your-app.com/webhooks/universalblog",
  "events": ["post.published", "analytics.updated"],
  "secret": "your-webhook-secret",
  "active": true
}`
  },
  {
    step: 3,
    title: 'Verify Signatures',
    description: 'Implement signature verification for security',
    code: `const crypto = require('crypto');

function verifySignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return signature === \`sha256=\${expectedSignature}\`;
}`
  },
  {
    step: 4,
    title: 'Handle Events',
    description: 'Process different webhook events in your application',
    code: `function handleWebhookEvent(payload) {
  switch (payload.event) {
    case 'post.published':
      // Update your analytics dashboard
      updateAnalytics(payload.data);
      break;
      
    case 'workflow.completed':
      // Notify team members
      notifyTeam(payload.data);
      break;
      
    default:
      console.log('Unhandled event:', payload.event);
  }
}`
  }
]

const bestPractices = [
  {
    title: 'Idempotency',
    description: 'Handle duplicate webhook deliveries gracefully',
    tips: [
      'Use unique event IDs to detect duplicates',
      'Store processed event IDs to prevent reprocessing',
      'Design handlers to be idempotent',
      'Return 200 status for already processed events'
    ]
  },
  {
    title: 'Error Handling',
    description: 'Implement robust error handling and retry logic',
    tips: [
      'Return appropriate HTTP status codes',
      'Log errors for debugging and monitoring',
      'Implement exponential backoff for retries',
      'Set up dead letter queues for failed events'
    ]
  },
  {
    title: 'Security',
    description: 'Secure your webhook endpoints properly',
    tips: [
      'Always verify webhook signatures',
      'Use HTTPS for webhook URLs',
      'Implement rate limiting on endpoints',
      'Validate and sanitize incoming data'
    ]
  },
  {
    title: 'Performance',
    description: 'Optimize webhook processing for reliability',
    tips: [
      'Process webhooks asynchronously when possible',
      'Keep response times under 10 seconds',
      'Use queues for heavy processing tasks',
      'Monitor webhook endpoint performance'
    ]
  }
]

export default function WebhooksPage() {
  return (
    <PageLayout>
      <PageHero
        title="Webhooks"
        description="Receive real-time notifications about events in your Universal Blog Platform account using webhooks."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-6 w-6" />
                What are Webhooks?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Webhooks are HTTP callbacks that Universal Blog Platform sends to your application 
                when specific events occur. They enable real-time integration and automation by 
                notifying your systems immediately when something happens in your account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified instantly when events occur
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Code className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple HTTP endpoints for seamless integration
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Secure Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Signed payloads and HTTPS for security
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Events */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Available Webhook Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webhookEvents.map((event, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {event.event}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{event.description}</p>
                        <p className="text-xs text-muted-foreground">{event.payload}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Setup Guide */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Setup Guide</h2>
            <div className="space-y-8">
              {setupSteps.map((step, index) => (
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
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{step.code}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => navigator.clipboard.writeText(step.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Webhook Payload Example */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Example Webhook Payload</CardTitle>
              <CardDescription>
                Sample payload structure for a post.published event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "id": "evt_1234567890",
  "event": "post.published",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "post": {
      "id": "post_abc123",
      "title": "My Amazing Blog Post",
      "content": "This is the content of my post...",
      "status": "published",
      "author": {
        "id": "user_xyz789",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "platforms": [
        {
          "name": "twitter",
          "status": "published",
          "url": "https://twitter.com/user/status/123",
          "published_at": "2024-01-15T10:30:00Z"
        },
        {
          "name": "linkedin",
          "status": "published", 
          "url": "https://linkedin.com/posts/123",
          "published_at": "2024-01-15T10:30:05Z"
        }
      ],
      "created_at": "2024-01-15T09:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}`}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText('webhook payload')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bestPractices.map((practice, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{practice.title}</CardTitle>
                    <CardDescription>{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <Card className="mb-12 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertCircle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-orange-800">
                <div>
                  <h4 className="font-semibold mb-2">Webhook Not Received</h4>
                  <p className="text-sm">
                    Check that your endpoint is publicly accessible, returns 200 status codes, 
                    and responds within 10 seconds. Verify your webhook URL is correct.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Signature Verification Fails</h4>
                  <p className="text-sm">
                    Ensure you're using the correct webhook secret and following the signature 
                    verification process exactly as documented.
                  </p>
                </div>
                <Separator className="bg-orange-200" />
                <div>
                  <h4 className="font-semibold mb-2">Duplicate Events</h4>
                  <p className="text-sm">
                    Implement idempotency by tracking processed event IDs. Webhooks may be 
                    delivered multiple times due to network issues or retries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhook Management */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Webhook Management
              </CardTitle>
              <CardDescription>
                Monitor and manage your webhooks through the platform dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Management Features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Create and configure webhook endpoints</li>
                    <li>• Select specific events to subscribe to</li>
                    <li>• Test webhooks with sample payloads</li>
                    <li>• Enable/disable webhooks as needed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Monitoring & Debugging:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• View delivery logs and response codes</li>
                    <li>• Monitor webhook success/failure rates</li>
                    <li>• Retry failed webhook deliveries</li>
                    <li>• Debug with detailed error messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Using Webhooks</h2>
            <p className="text-muted-foreground mb-6">
              Set up webhooks to receive real-time notifications and automate your workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/webhooks">
                  <Webhook className="mr-2 h-4 w-4" />
                  Manage Webhooks
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/integrations">
                  Learn About Integrations
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
