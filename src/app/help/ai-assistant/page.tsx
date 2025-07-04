import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Lightbulb, 
  Edit,
  Zap,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understanding the AI Writing Assistant',
  description: 'Learn how to use the AI writing assistant to create better content faster.',
}

const aiFeatures = [
  {
    icon: Edit,
    title: 'Content Generation',
    description: 'Generate ideas, outlines, and full content pieces',
    examples: ['Blog post ideas', 'Social media captions', 'Email newsletters', 'Product descriptions']
  },
  {
    icon: Lightbulb,
    title: 'Content Enhancement',
    description: 'Improve existing content with AI suggestions',
    examples: ['Grammar and style fixes', 'Tone adjustments', 'SEO optimization', 'Readability improvements']
  },
  {
    icon: Zap,
    title: 'Platform Optimization',
    description: 'Adapt content for different platforms automatically',
    examples: ['Twitter thread creation', 'LinkedIn post formatting', 'Instagram captions', 'Blog post summaries']
  }
]

const useCases = [
  {
    scenario: 'Writer\'s Block',
    solution: 'Use AI to generate topic ideas and content outlines',
    steps: ['Describe your topic or industry', 'Ask for content ideas', 'Select and expand on suggestions', 'Refine with your expertise']
  },
  {
    scenario: 'Time Constraints',
    solution: 'Generate first drafts quickly, then edit and personalize',
    steps: ['Provide key points to cover', 'Generate initial draft', 'Review and edit content', 'Add personal insights']
  },
  {
    scenario: 'Platform Adaptation',
    solution: 'Transform one piece of content for multiple platforms',
    steps: ['Start with your main content', 'Select target platforms', 'Let AI adapt formatting', 'Review and approve changes']
  }
]

export default function AIAssistantPage() {
  return (
    <PageLayout>
      <PageHero
        title="Understanding the AI Writing Assistant"
        description="Master the AI writing assistant to create better content faster and overcome creative blocks."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Start */}
          <Card className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Try the AI Assistant
              </CardTitle>
              <CardDescription>
                Start using AI to enhance your content creation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/admin/ai">
                    <Bot className="mr-2 h-4 w-4" />
                    Open AI Assistant
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/admin/ai">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">AI Assistant Features</h2>
            <div className="space-y-8">
              {aiFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-3">Examples:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {feature.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="p-3 bg-muted/50 rounded-lg text-sm">
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Use Cases */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Common Use Cases</h2>
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{useCase.scenario}</CardTitle>
                    <CardDescription>{useCase.solution}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">How to do it:</h4>
                    <ol className="space-y-1">
                      {useCase.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="font-bold text-primary">{stepIndex + 1}.</span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>AI Assistant Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Provide clear, specific prompts
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Review and edit AI-generated content
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Add your personal insights and expertise
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Use AI for brainstorming and first drafts
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Experiment with different prompts
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Publish AI content without review
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Rely solely on AI for all content
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Use vague or unclear prompts
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Ignore fact-checking and accuracy
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
                      Forget to add your unique voice
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Examples */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Effective Prompt Examples</CardTitle>
              <CardDescription>
                Learn how to write prompts that get better results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Content Ideas:</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-mono">
                      "Generate 10 blog post ideas about sustainable living for millennials who are just starting their eco-friendly journey"
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Content Enhancement:</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-mono">
                      "Improve this paragraph for better readability and engagement: [paste your content]"
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platform Adaptation:</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm font-mono">
                      "Convert this blog post into a Twitter thread with 8-10 tweets, maintaining the key points and adding engaging hooks"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                  <h4 className="font-semibold mb-2">AI responses are too generic</h4>
                  <p className="text-sm text-muted-foreground">
                    Solution: Provide more specific context, target audience details, and desired tone in your prompts.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
                  <h4 className="font-semibold mb-2">Content doesn't match my brand voice</h4>
                  <p className="text-sm text-muted-foreground">
                    Solution: Include examples of your brand voice and specific tone requirements in your prompts.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-green-400 bg-green-50">
                  <h4 className="font-semibold mb-2">AI suggestions aren't relevant</h4>
                  <p className="text-sm text-muted-foreground">
                    Solution: Provide more context about your industry, audience, and content goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Use AI?</h2>
            <p className="text-muted-foreground mb-6">
              Start using the AI assistant to enhance your content creation workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/admin/ai">
                  <Bot className="mr-2 h-4 w-4" />
                  Try AI Assistant
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/ai-writing">
                  Read Full AI Guide
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
