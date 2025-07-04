import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Zap, 
  Target, 
  Settings,
  ArrowRight,
  Lightbulb,
  FileText,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Writing Assistant',
  description: 'Learn how to use Universal Blog Platform\'s AI writing assistant to create engaging content faster.',
}

const features = [
  {
    icon: Brain,
    title: 'Smart Content Generation',
    description: 'Generate high-quality content based on your prompts and preferences'
  },
  {
    icon: Target,
    title: 'Tone & Style Control',
    description: 'Adjust writing tone from professional to casual, creative to technical'
  },
  {
    icon: Sparkles,
    title: 'SEO Optimization',
    description: 'Automatically optimize content for search engines and engagement'
  },
  {
    icon: Settings,
    title: 'Custom Templates',
    description: 'Use pre-built templates or create your own for consistent content'
  }
]

export default function AIWritingPage() {
  return (
    <PageLayout>
      <PageHero
        title="AI Writing Assistant"
        description="Master the art of AI-powered content creation with our comprehensive guide to the writing assistant."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Getting Started with AI Writing
              </CardTitle>
              <CardDescription>
                Our AI writing assistant helps you create engaging content faster while maintaining your unique voice and style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The AI writing assistant is powered by advanced language models that understand context, tone, and audience. 
                Whether you're writing blog posts, social media content, or marketing copy, the AI can help you overcome 
                writer's block and create compelling content that resonates with your audience.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Use */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>How to Use the AI Writing Assistant</CardTitle>
              <CardDescription>
                Follow these steps to get the most out of our AI-powered writing tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Start with a Clear Prompt</h3>
                    <p className="text-muted-foreground">
                      Provide a clear, specific prompt about what you want to write. Include topic, audience, and desired tone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Choose Your Writing Mode</h3>
                    <p className="text-muted-foreground">
                      Select from Creative, Professional, Casual, or Technical modes based on your content needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Review and Refine</h3>
                    <p className="text-muted-foreground">
                      Review the generated content and use the refinement tools to adjust tone, length, or focus.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optimize and Publish</h3>
                    <p className="text-muted-foreground">
                      Use the SEO optimization features and publish across your connected platforms.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
              <CardDescription>
                Tips to get the best results from the AI writing assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Be specific with your prompts</li>
                    <li>• Specify your target audience</li>
                    <li>• Use the tone controls effectively</li>
                    <li>• Review and edit generated content</li>
                    <li>• Experiment with different modes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Use vague or unclear prompts</li>
                    <li>• Publish without reviewing</li>
                    <li>• Ignore SEO suggestions</li>
                    <li>• Use inappropriate tone for audience</li>
                    <li>• Rely solely on AI without editing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Resources */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Button variant="outline" asChild>
                <Link href="/docs/templates">
                  <FileText className="mr-2 h-4 w-4" />
                  Content Templates
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/seo">
                  <Zap className="mr-2 h-4 w-4" />
                  SEO Optimization
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/publishing">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Publishing Guide
                </Link>
              </Button>
            </div>
            <Button size="lg" asChild>
              <Link href="/docs">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Documentation
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
