import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Key, 
  Book,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Complete API reference for integrating with Universal Blog Platform programmatically.',
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/posts',
    description: 'Create a new post',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/posts',
    description: 'List all posts',
    auth: 'Required'
  },
  {
    method: 'PUT',
    path: '/api/v1/posts/{id}',
    description: 'Update a post',
    auth: 'Required'
  },
  {
    method: 'DELETE',
    path: '/api/v1/posts/{id}',
    description: 'Delete a post',
    auth: 'Required'
  },
  {
    method: 'POST',
    path: '/api/v1/posts/{id}/publish',
    description: 'Publish a post to platforms',
    auth: 'Required'
  },
  {
    method: 'GET',
    path: '/api/v1/analytics',
    description: 'Get analytics data',
    auth: 'Required'
  }
]

export default function APIPage() {
  return (
    <PageLayout>
      <PageHero
        title="API Documentation"
        description="Integrate Universal Blog Platform into your applications with our comprehensive REST API."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Quick Start
              </CardTitle>
              <CardDescription>
                Get started with our API in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <Key className="mr-2 h-4 w-4" />
                  Get API Key
                </Button>
                <Button size="lg" variant="outline">
                  <Book className="mr-2 h-4 w-4" />
                  View Examples
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Core endpoints for managing content and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        endpoint.method === 'GET' ? 'secondary' :
                        endpoint.method === 'POST' ? 'default' :
                        endpoint.method === 'PUT' ? 'outline' : 'destructive'
                      }>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{endpoint.auth}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">API Key Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Include your API key in the Authorization header:
                  </p>
                  <code className="block p-3 bg-black text-green-400 rounded text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Start Building</h2>
            <p className="text-muted-foreground mb-6">
              Get your API key and start integrating with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Key className="mr-2 h-4 w-4" />
                Get API Key
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/api-auth">
                  Authentication Guide
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
