import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Code,
  Download,
  BookOpen,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Terminal,
  Package,
  Zap,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'SDKs & Libraries - Universal Blog Platform',
  description: 'Official SDKs and libraries for integrating with Universal Blog Platform. Available for JavaScript, Python, PHP, and more.',
}

const sdks = [
  {
    language: 'JavaScript',
    description: 'Official JavaScript SDK for web and Node.js applications',
    version: 'v2.1.0',
    status: 'Stable',
    downloads: '15.2k/month',
    features: [
      'TypeScript support',
      'Promise-based API',
      'Automatic retries',
      'Built-in error handling',
      'Tree-shakeable'
    ],
    installation: 'npm install @universalblog/sdk',
    href: '/docs/sdk/javascript',
    github: 'https://github.com/universalblog/javascript-sdk',
    featured: true
  },
  {
    language: 'Python',
    description: 'Python SDK for server-side integrations and automation',
    version: 'v1.8.0',
    status: 'Stable',
    downloads: '8.7k/month',
    features: [
      'Async/await support',
      'Type hints',
      'Pagination helpers',
      'Rate limiting',
      'Django integration'
    ],
    installation: 'pip install universalblog-sdk',
    href: '/docs/sdk/python',
    github: 'https://github.com/universalblog/python-sdk',
    featured: true
  },
  {
    language: 'PHP',
    description: 'PHP SDK for WordPress plugins and web applications',
    version: 'v1.5.0',
    status: 'Stable',
    downloads: '5.3k/month',
    features: [
      'PSR-4 autoloading',
      'Composer support',
      'WordPress helpers',
      'Guzzle HTTP client',
      'Laravel integration'
    ],
    installation: 'composer require universalblog/sdk',
    href: '/docs/sdk/php',
    github: 'https://github.com/universalblog/php-sdk',
    featured: false
  },
  {
    language: 'Ruby',
    description: 'Ruby gem for Rails applications and automation scripts',
    version: 'v1.3.0',
    status: 'Stable',
    downloads: '2.1k/month',
    features: [
      'Rails integration',
      'ActiveRecord helpers',
      'Faraday HTTP client',
      'RSpec matchers',
      'Sidekiq support'
    ],
    installation: 'gem install universalblog',
    href: '/docs/sdk/ruby',
    github: 'https://github.com/universalblog/ruby-sdk',
    featured: false
  },
  {
    language: 'Go',
    description: 'Go package for high-performance server applications',
    version: 'v1.2.0',
    status: 'Beta',
    downloads: '1.8k/month',
    features: [
      'Context support',
      'Structured logging',
      'Concurrent requests',
      'Zero dependencies',
      'HTTP/2 support'
    ],
    installation: 'go get github.com/universalblog/go-sdk',
    href: '/docs/sdk/go',
    github: 'https://github.com/universalblog/go-sdk',
    featured: false
  },
  {
    language: 'C#/.NET',
    description: '.NET library for Windows applications and services',
    version: 'v1.1.0',
    status: 'Beta',
    downloads: '1.2k/month',
    features: [
      '.NET Standard 2.0',
      'Async/await pattern',
      'Dependency injection',
      'Configuration binding',
      'Logging integration'
    ],
    installation: 'dotnet add package UniversalBlog.SDK',
    href: '/docs/sdk/dotnet',
    github: 'https://github.com/universalblog/dotnet-sdk',
    featured: false
  }
]

const quickStart = [
  {
    step: '1',
    title: 'Choose Your SDK',
    description: 'Select the SDK for your preferred programming language',
    icon: Package
  },
  {
    step: '2',
    title: 'Install & Configure',
    description: 'Install the SDK and configure it with your API credentials',
    icon: Download
  },
  {
    step: '3',
    title: 'Start Building',
    description: 'Use the SDK to integrate with our platform and build amazing features',
    icon: Code
  }
]

export default function SDKPage() {
  return (
    <PageLayout>
      <PageHero
        title="SDKs & Libraries"
        description="Official SDKs and libraries for integrating with Universal Blog Platform. Build powerful applications with our developer-friendly tools."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#sdks">
              <Code className="mr-2 h-4 w-4" />
              Browse SDKs
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs/api">
              <BookOpen className="mr-2 h-4 w-4" />
              API Documentation
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* SDK Overview */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Use Our SDKs?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our SDKs provide a seamless integration experience with built-in best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Zap,
              title: 'Fast Integration',
              description: 'Get up and running in minutes with simple, intuitive APIs'
            },
            {
              icon: Shield,
              title: 'Built-in Security',
              description: 'Automatic authentication, rate limiting, and error handling'
            },
            {
              icon: Globe,
              title: 'Cross-Platform',
              description: 'Available for all major programming languages and frameworks'
            },
            {
              icon: Smartphone,
              title: 'Mobile Ready',
              description: 'Optimized for mobile applications and responsive web apps'
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Available SDKs */}
      <ContentSection id="sdks" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Available SDKs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of official SDKs for your preferred language
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sdks.map((sdk, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${sdk.featured ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{sdk.language}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={sdk.status === 'Stable' ? 'default' : 'secondary'}>
                          {sdk.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{sdk.version}</span>
                      </div>
                    </div>
                  </div>
                  {sdk.featured && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardDescription>{sdk.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Downloads:</span>
                    <span className="font-medium">{sdk.downloads}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {sdk.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Installation:</span>
                    </div>
                    <code className="text-sm font-mono">{sdk.installation}</code>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={sdk.href}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Documentation
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={sdk.github} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Quick Start */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with our SDKs in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickStart.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Code Example */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Example Usage</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's how easy it is to get started with our JavaScript SDK
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Install the SDK</h4>
                  <div className="p-4 bg-black text-green-400 rounded-lg font-mono text-sm">
                    npm install @universalblog/sdk
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Initialize and use</h4>
                  <div className="p-4 bg-black text-green-400 rounded-lg font-mono text-sm">
                    <div>import UniversalBlog from '@universalblog/sdk';</div>
                    <div className="mt-2">const client = new UniversalBlog(&#123;</div>
                    <div>&nbsp;&nbsp;apiKey: 'your-api-key',</div>
                    <div>&nbsp;&nbsp;baseURL: 'https://api.universalblog.com'</div>
                    <div>&#125;);</div>
                    <div className="mt-2">// Create a new post</div>
                    <div>const post = await client.posts.create(&#123;</div>
                    <div>&nbsp;&nbsp;title: 'My First Post',</div>
                    <div>&nbsp;&nbsp;content: 'Hello, world!',</div>
                    <div>&nbsp;&nbsp;platforms: ['twitter', 'linkedin']</div>
                    <div>&#125;);</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>

      {/* Support */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get support and connect with other developers using our SDKs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Documentation',
              description: 'Comprehensive guides and API references for each SDK',
              icon: BookOpen,
              href: '/docs'
            },
            {
              title: 'Community Forum',
              description: 'Ask questions and share knowledge with other developers',
              icon: Globe,
              href: '/community'
            },
            {
              title: 'GitHub Issues',
              description: 'Report bugs and request features on our GitHub repositories',
              icon: ExternalLink,
              href: 'https://github.com/universalblog'
            }
          ].map((resource, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <resource.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {resource.description}
                </CardDescription>
                <Button variant="outline" asChild className="w-full">
                  <Link href={resource.href}>
                    Visit {resource.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Building Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your preferred SDK and start integrating with Universal Blog Platform in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/docs/sdk/javascript">
                <Code className="mr-2 h-4 w-4" />
                Get Started with JavaScript
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/docs/api">
                <BookOpen className="mr-2 h-4 w-4" />
                View API Docs
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
