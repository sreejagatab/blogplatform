import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Puzzle, 
  Zap, 
  Code, 
  Settings, 
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Download,
  Globe,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Custom Integrations - Documentation',
  description: 'Learn how to build custom integrations with Universal Blog Platform using our API, webhooks, and SDKs.',
}

const integrationTypes = [
  {
    name: 'Platform Integrations',
    description: 'Connect new social media platforms and publishing channels',
    icon: Globe,
    complexity: 'Medium',
    examples: ['Custom social networks', 'Niche publishing platforms', 'Internal company portals'],
    apis: ['Publishing API', 'Authentication API', 'Media Upload API']
  },
  {
    name: 'Analytics Integrations',
    description: 'Connect external analytics and reporting tools',
    icon: BarChart3,
    complexity: 'Low',
    examples: ['Google Analytics', 'Custom dashboards', 'Business intelligence tools'],
    apis: ['Analytics API', 'Webhooks', 'Export API']
  },
  {
    name: 'Workflow Integrations',
    description: 'Automate content workflows with external tools',
    icon: Zap,
    complexity: 'Medium',
    examples: ['Slack notifications', 'Email automation', 'Project management tools'],
    apis: ['Webhooks', 'Workflow API', 'Notifications API']
  },
  {
    name: 'Communication Integrations',
    description: 'Integrate with team communication and collaboration tools',
    icon: MessageSquare,
    complexity: 'Low',
    examples: ['Slack bots', 'Microsoft Teams', 'Discord notifications'],
    apis: ['Webhooks', 'Team API', 'Notifications API']
  }
]

const developmentSteps = [
  {
    step: 1,
    title: 'Plan Your Integration',
    description: 'Define requirements and choose the right integration approach',
    tasks: [
      'Identify the specific use case and requirements',
      'Choose between API, webhooks, or SDK approach',
      'Review rate limits and authentication methods',
      'Plan the user experience and configuration flow'
    ]
  },
  {
    step: 2,
    title: 'Set Up Development Environment',
    description: 'Configure your development environment and tools',
    tasks: [
      'Create a developer account and get API credentials',
      'Set up a test environment with sample data',
      'Install SDKs or set up API client libraries',
      'Configure webhook endpoints for testing'
    ]
  },
  {
    step: 3,
    title: 'Build Core Functionality',
    description: 'Implement the main integration features',
    tasks: [
      'Implement authentication and authorization',
      'Build core API interactions and data handling',
      'Add error handling and retry logic',
      'Implement webhook processing if needed'
    ]
  },
  {
    step: 4,
    title: 'Test and Deploy',
    description: 'Thoroughly test your integration and deploy to production',
    tasks: [
      'Test with various data scenarios and edge cases',
      'Validate error handling and recovery mechanisms',
      'Perform security and performance testing',
      'Deploy to production and monitor performance'
    ]
  }
]

const sdks = [
  {
    name: 'JavaScript/Node.js SDK',
    description: 'Full-featured SDK for JavaScript and Node.js applications',
    features: ['Promise-based API', 'TypeScript support', 'Automatic retries', 'Built-in validation'],
    installation: 'npm install @universalblog/sdk'
  },
  {
    name: 'Python SDK',
    description: 'Comprehensive Python library for server-side integrations',
    features: ['Async/await support', 'Pydantic models', 'Automatic pagination', 'Error handling'],
    installation: 'pip install universalblog-python'
  },
  {
    name: 'PHP SDK',
    description: 'Easy-to-use PHP library for web applications',
    features: ['PSR-4 autoloading', 'Guzzle HTTP client', 'Exception handling', 'Laravel support'],
    installation: 'composer require universalblog/php-sdk'
  },
  {
    name: 'Go SDK',
    description: 'Lightweight Go library for high-performance applications',
    features: ['Context support', 'Structured logging', 'Concurrent operations', 'Minimal dependencies'],
    installation: 'go get github.com/universalblog/go-sdk'
  }
]

const integrationExamples = [
  {
    title: 'Slack Content Notifications',
    description: 'Get notified in Slack when content is published or needs review',
    difficulty: 'Beginner',
    technologies: ['Webhooks', 'Slack API'],
    features: ['Real-time notifications', 'Custom message formatting', 'Channel routing']
  },
  {
    title: 'Custom Analytics Dashboard',
    description: 'Build a custom dashboard with your own analytics and KPIs',
    difficulty: 'Intermediate',
    technologies: ['Analytics API', 'React/Vue.js', 'Chart.js'],
    features: ['Real-time data', 'Custom metrics', 'Export functionality']
  },
  {
    title: 'Content Approval Workflow',
    description: 'Integrate with project management tools for content approval',
    difficulty: 'Advanced',
    technologies: ['Workflow API', 'Webhooks', 'External APIs'],
    features: ['Multi-stage approval', 'Automated routing', 'Status tracking']
  }
]

export default function IntegrationsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Custom Integrations"
        description="Build powerful integrations with Universal Blog Platform using our comprehensive APIs, webhooks, and SDKs."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-6 w-6" />
                Integration Possibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Universal Blog Platform provides flexible integration options to connect with your 
                existing tools and workflows. Whether you're building a simple notification system 
                or a complex multi-platform publishing solution, our APIs and SDKs have you covered.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">RESTful APIs</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive REST APIs for all platform features
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Webhooks</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant notifications for events and updates
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Official SDKs</h3>
                  <p className="text-sm text-muted-foreground">
                    Ready-to-use libraries for popular languages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Types */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Integration Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrationTypes.map((type, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <type.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <CardDescription>{type.description}</CardDescription>
                          <Badge variant="outline" className="text-xs">
                            {type.complexity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Examples:</h4>
                        <ul className="space-y-1">
                          {type.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="text-sm text-muted-foreground">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Required APIs:</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.apis.map((api, apiIndex) => (
                            <Badge key={apiIndex} variant="secondary" className="text-xs">
                              {api}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Development Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Development Process</h2>
            <div className="space-y-8">
              {developmentSteps.map((step, index) => (
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
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SDKs */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Official SDKs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sdks.map((sdk, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{sdk.name}</CardTitle>
                    <CardDescription>{sdk.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {sdk.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm text-muted-foreground flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Installation:</h4>
                        <code className="text-sm">{sdk.installation}</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Integration Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Integration Examples</h2>
            <div className="space-y-6">
              {integrationExamples.map((example, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{example.title}</CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </div>
                      <Badge variant={
                        example.difficulty === 'Beginner' ? 'default' :
                        example.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
                      }>
                        {example.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-1">
                          {example.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {example.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="text-sm text-muted-foreground">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Developer Resources */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Developer Resources
              </CardTitle>
              <CardDescription>
                Everything you need to build successful integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Documentation:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <Link href="/docs/api" className="text-primary hover:underline">Complete API Reference</Link></li>
                    <li>• <Link href="/docs/webhooks" className="text-primary hover:underline">Webhook Documentation</Link></li>
                    <li>• <Link href="/docs/api-auth" className="text-primary hover:underline">Authentication Guide</Link></li>
                    <li>• Code examples and tutorials</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support & Community:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Developer support forum</li>
                    <li>• GitHub repositories with examples</li>
                    <li>• Regular developer office hours</li>
                    <li>• Integration showcase and gallery</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Testing & Development:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Sandbox environment for testing</li>
                    <li>• Postman collections for API testing</li>
                    <li>• Webhook testing tools</li>
                    <li>• Rate limit monitoring dashboard</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Publishing & Distribution:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Integration marketplace listing</li>
                    <li>• Partner program opportunities</li>
                    <li>• Marketing and promotion support</li>
                    <li>• Revenue sharing options</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Ready to Build?</CardTitle>
              <CardDescription className="text-blue-700">
                Start building your integration today with our comprehensive developer tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/admin/api-keys">
                    <Code className="mr-2 h-4 w-4" />
                    Get API Keys
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/docs/api">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View API Docs
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/universalblog/examples" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Examples
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Building Integrations</h2>
            <p className="text-muted-foreground mb-6">
              Explore our APIs, download SDKs, and start building powerful integrations today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/api">
                  <Code className="mr-2 h-4 w-4" />
                  Explore APIs
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community/developers">
                  Join Developer Community
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
