import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Key, 
  Zap, 
  Shield,
  ArrowRight,
  Copy,
  ExternalLink,
  BookOpen,
  Terminal,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Comprehensive API documentation for Universal Blog Platform. Build powerful integrations and automate your content workflow.',
}

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/posts',
    description: 'Retrieve all posts',
    auth: true
  },
  {
    method: 'POST',
    path: '/api/v1/posts',
    description: 'Create a new post',
    auth: true
  },
  {
    method: 'PUT',
    path: '/api/v1/posts/{id}',
    description: 'Update an existing post',
    auth: true
  },
  {
    method: 'DELETE',
    path: '/api/v1/posts/{id}',
    description: 'Delete a post',
    auth: true
  },
  {
    method: 'POST',
    path: '/api/v1/posts/{id}/publish',
    description: 'Publish post to platforms',
    auth: true
  },
  {
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Get analytics data',
    auth: true
  }
]

const sdks = [
  {
    name: 'JavaScript/Node.js',
    description: 'Official SDK for JavaScript and Node.js applications',
    install: 'npm install @universalblog/sdk',
    docs: '/docs/sdk/javascript'
  },
  {
    name: 'Python',
    description: 'Official SDK for Python applications',
    install: 'pip install universalblog-sdk',
    docs: '/docs/sdk/python'
  },
  {
    name: 'PHP',
    description: 'Official SDK for PHP applications',
    install: 'composer require universalblog/sdk',
    docs: '/docs/sdk/php'
  },
  {
    name: 'Ruby',
    description: 'Official SDK for Ruby applications',
    install: 'gem install universalblog-sdk',
    docs: '/docs/sdk/ruby'
  }
]

const codeExamples = {
  javascript: `// Initialize the SDK
import { UniversalBlog } from '@universalblog/sdk';

const client = new UniversalBlog({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.universalblog.com'
});

// Create a new post
const post = await client.posts.create({
  title: 'My Amazing Blog Post',
  content: 'This is the content of my post...',
  platforms: ['twitter', 'linkedin', 'medium'],
  scheduledAt: '2024-01-01T12:00:00Z'
});

console.log('Post created:', post.id);`,
  
  python: `# Initialize the SDK
from universalblog import UniversalBlog

client = UniversalBlog(
    api_key='your-api-key',
    base_url='https://api.universalblog.com'
)

# Create a new post
post = client.posts.create({
    'title': 'My Amazing Blog Post',
    'content': 'This is the content of my post...',
    'platforms': ['twitter', 'linkedin', 'medium'],
    'scheduled_at': '2024-01-01T12:00:00Z'
})

print(f'Post created: {post.id}')`,

  curl: `# Create a new post
curl -X POST https://api.universalblog.com/v1/posts \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Amazing Blog Post",
    "content": "This is the content of my post...",
    "platforms": ["twitter", "linkedin", "medium"],
    "scheduledAt": "2024-01-01T12:00:00Z"
  }'`
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-green-100 text-green-800'
    case 'POST': return 'bg-blue-100 text-blue-800'
    case 'PUT': return 'bg-yellow-100 text-yellow-800'
    case 'DELETE': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function APIDocsPage() {
  return (
    <PageLayout>
      <PageHero
        title="API Documentation"
        description="Build powerful integrations with our comprehensive REST API. Automate your content workflow and scale your distribution."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signup">
              Get API Key
              <Key className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs/api/quick-start">
              Quick Start Guide
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* API Overview */}
      <ContentSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">RESTful API</CardTitle>
              </div>
              <CardDescription>
                Simple, predictable REST API with JSON responses
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Secure</CardTitle>
              </div>
              <CardDescription>
                API key authentication with rate limiting and HTTPS
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Global CDN</CardTitle>
              </div>
              <CardDescription>
                Fast response times worldwide with 99.9% uptime
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Code Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Get Started in Minutes
          </h2>
          
          <Tabs defaultValue="javascript" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([key, code]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      <CardTitle className="text-lg capitalize">{key} Example</CardTitle>
                    </div>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{code}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* API Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            API Endpoints
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.auth && (
                        <Badge variant="outline">
                          <Key className="h-3 w-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {endpoint.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SDKs */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">
            Official SDKs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sdks.map((sdk, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{sdk.name}</CardTitle>
                  <CardDescription>{sdk.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Installation:</p>
                    <code className="bg-muted p-2 rounded text-sm block">
                      {sdk.install}
                    </code>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={sdk.docs}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Documentation
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get your API key and start integrating with Universal Blog Platform today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
