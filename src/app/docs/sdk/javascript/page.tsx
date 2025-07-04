import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code, 
  Download, 
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Terminal
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'JavaScript SDK',
  description: 'Official JavaScript SDK for Universal Blog Platform API integration.',
}

export default function JavaScriptSDKPage() {
  return (
    <PageLayout>
      <PageHero
        title="JavaScript SDK"
        description="Official JavaScript SDK for seamless integration with Universal Blog Platform."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-blue-50 to-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Installation
              </CardTitle>
              <CardDescription>
                Get started with the JavaScript SDK in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-black text-green-400 rounded-lg">
                  <code>npm install @universal-blog-platform/sdk</code>
                </div>
                <div className="flex gap-4">
                  <Button size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download SDK
                  </Button>
                  <Button size="lg" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Usage */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Basic Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Initialize the SDK</h3>
                  <pre className="text-sm bg-black text-green-400 p-3 rounded overflow-x-auto">
{`import { UniversalBlogPlatform } from '@universal-blog-platform/sdk';

const ubp = new UniversalBlogPlatform({
  apiKey: 'your-api-key',
  baseURL: 'https://api.universalblogplatform.com'
});`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Create a Post</h3>
                  <pre className="text-sm bg-black text-green-400 p-3 rounded overflow-x-auto">
{`const post = await ubp.posts.create({
  title: 'My First Post',
  content: 'This is the content of my post',
  platforms: ['twitter', 'linkedin'],
  scheduledAt: new Date('2024-12-25T10:00:00Z')
});`}
                  </pre>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Get Analytics</h3>
                  <pre className="text-sm bg-black text-green-400 p-3 rounded overflow-x-auto">
{`const analytics = await ubp.analytics.get({
  postId: 'post-id',
  dateRange: {
    start: '2024-12-01',
    end: '2024-12-31'
  }
});`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>SDK Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">TypeScript support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Promise-based API</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Automatic retries</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Error handling</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Rate limiting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Webhook support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Download the SDK and start building amazing integrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download SDK
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/api">
                  API Documentation
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
