import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/layout/page-hero'
import { ContentSection } from '@/components/layout/content-section'
import {
  Brain,
  Zap,
  FileText,
  Image,
  Languages,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Download,
  Sparkles,
  Target,
  BarChart3
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Writing Toolkit - Universal Blog Platform',
  description: 'Master AI-powered content creation with our comprehensive toolkit. Templates, prompts, workflows, and best practices for AI writing.',
}

const aiTools = [
  {
    icon: FileText,
    title: 'AI Writing Prompts Library',
    description: '500+ proven prompts for different content types',
    features: [
      'Blog post prompts by industry',
      'Social media content prompts',
      'Email marketing prompts',
      'Product description prompts'
    ],
    category: 'Prompts'
  },
  {
    icon: Brain,
    title: 'Content Optimization Framework',
    description: 'Systematic approach to AI-assisted content improvement',
    features: [
      'SEO optimization workflows',
      'Readability enhancement prompts',
      'Tone and style adjustment guides',
      'Content structure templates'
    ],
    category: 'Framework'
  },
  {
    icon: Languages,
    title: 'Multi-Language Content Kit',
    description: 'Create content in multiple languages with AI',
    features: [
      'Translation quality prompts',
      'Cultural adaptation guidelines',
      'Localization best practices',
      'Language-specific templates'
    ],
    category: 'Localization'
  },
  {
    icon: TrendingUp,
    title: 'Trend Analysis Prompts',
    description: 'Stay ahead with AI-powered trend identification',
    features: [
      'Industry trend analysis prompts',
      'Competitor content analysis',
      'Viral content pattern recognition',
      'Seasonal content planning'
    ],
    category: 'Analysis'
  },
  {
    icon: Image,
    title: 'Visual Content AI Prompts',
    description: 'Generate ideas for visual content with AI',
    features: [
      'Image description prompts',
      'Infographic content outlines',
      'Video script templates',
      'Visual storytelling frameworks'
    ],
    category: 'Visual'
  },
  {
    icon: Target,
    title: 'Audience-Specific Templates',
    description: 'Tailored content for different audience segments',
    features: [
      'B2B content templates',
      'B2C engagement prompts',
      'Technical writing guides',
      'Creative content frameworks'
    ],
    category: 'Audience'
  }
]

const workflows = [
  {
    title: 'Blog Post Creation Workflow',
    description: 'Complete AI-assisted blog writing process',
    steps: [
      'Topic research and validation',
      'Outline generation and refinement',
      'Content creation and expansion',
      'SEO optimization and editing'
    ],
    duration: '30 minutes',
    difficulty: 'Beginner'
  },
  {
    title: 'Social Media Campaign Workflow',
    description: 'Multi-platform social content creation',
    steps: [
      'Campaign theme development',
      'Platform-specific adaptation',
      'Visual content planning',
      'Engagement optimization'
    ],
    duration: '45 minutes',
    difficulty: 'Intermediate'
  },
  {
    title: 'Email Series Workflow',
    description: 'Automated email sequence creation',
    steps: [
      'Audience segmentation analysis',
      'Email sequence planning',
      'Content personalization',
      'Performance optimization'
    ],
    duration: '60 minutes',
    difficulty: 'Advanced'
  }
]

export default function AIToolkitPage() {
  return (
    <PageLayout>
      <PageHero
        title="AI Writing Toolkit"
        description="Master AI-powered content creation with our comprehensive toolkit. Get 500+ proven prompts, workflows, templates, and best practices to create amazing content faster."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#tools">
              <Sparkles className="mr-2 h-4 w-4" />
              Explore AI Tools
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resources/downloads">
              <Download className="mr-2 h-4 w-4" />
              Download Toolkit
            </Link>
          </Button>
        </div>
      </PageHero>

      {/* Toolkit Overview */}
      <ContentSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">What's Included</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>500+ AI Prompts:</strong> Proven prompts for every content type and industry
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Complete Workflows:</strong> Step-by-step processes for AI-assisted content creation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Best Practices Guide:</strong> Expert tips for getting the best results from AI tools
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Quality Control Framework:</strong> Ensure your AI-generated content meets high standards
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong>Regular Updates:</strong> New prompts and techniques added monthly
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Toolkit Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Prompts:</span>
                  <span className="font-semibold">500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workflows:</span>
                  <span className="font-semibold">25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Templates:</span>
                  <span className="font-semibold">100+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages:</span>
                  <span className="font-semibold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updates:</span>
                  <span className="font-semibold">Monthly</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/signup">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Toolkit Free
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>

      {/* AI Tools */}
      <ContentSection id="tools" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI Tools & Resources</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive collection of AI-powered tools for every aspect of content creation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiTools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{tool.category}</Badge>
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Workflows */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI Content Workflows</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Step-by-step workflows to streamline your AI-assisted content creation process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workflows.map((workflow, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={workflow.difficulty === 'Beginner' ? 'default' : workflow.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {workflow.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{workflow.duration}</span>
                </div>
                <CardTitle className="text-xl">{workflow.title}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {workflow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {stepIndex + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  View Workflow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Best Practices */}
      <ContentSection background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI Writing Best Practices</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Essential guidelines for creating high-quality content with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Prompt Engineering',
              tips: [
                'Be specific and detailed in your prompts',
                'Provide context and examples',
                'Use iterative refinement',
                'Test different prompt variations'
              ]
            },
            {
              title: 'Quality Control',
              tips: [
                'Always fact-check AI-generated content',
                'Review for brand voice consistency',
                'Check for plagiarism and originality',
                'Ensure proper grammar and style'
              ]
            },
            {
              title: 'Content Optimization',
              tips: [
                'Optimize for SEO after AI generation',
                'Add personal insights and experiences',
                'Include relevant data and statistics',
                'Enhance with visual elements'
              ]
            },
            {
              title: 'Ethical Considerations',
              tips: [
                'Disclose AI assistance when appropriate',
                'Respect copyright and fair use',
                'Avoid generating harmful content',
                'Maintain authenticity and transparency'
              ]
            }
          ].map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection background="primary" className="text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Supercharge Your Content Creation?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get instant access to our complete AI Writing Toolkit and start creating better content faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                <Sparkles className="mr-2 h-4 w-4" />
                Get Toolkit Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/resources">
                <ArrowRight className="mr-2 h-4 w-4" />
                Browse All Resources
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
