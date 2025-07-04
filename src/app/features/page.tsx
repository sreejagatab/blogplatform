import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Globe, 
  Brain, 
  BarChart3, 
  Shield, 
  Rocket,
  Users,
  Clock,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover the powerful features of Universal Blog Platform - AI-powered content distribution, advanced analytics, and seamless multi-platform publishing.',
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Content Creation',
    description: 'Generate high-quality blog posts, social media content, and marketing copy with our advanced AI writing assistant.',
    features: ['Content ideation', 'Auto-writing', 'SEO optimization', 'Tone adjustment']
  },
  {
    icon: Globe,
    title: 'Multi-Platform Distribution',
    description: 'Publish your content to 1000+ platforms simultaneously with a single click.',
    features: ['Social media networks', 'Blog platforms', 'News sites', 'Community forums']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance across all platforms with comprehensive analytics and insights.',
    features: ['Real-time metrics', 'Engagement tracking', 'ROI analysis', 'Custom reports']
  },
  {
    icon: Rocket,
    title: 'Automated Scheduling',
    description: 'Schedule content across time zones and platforms for maximum reach and engagement.',
    features: ['Smart scheduling', 'Time zone optimization', 'Bulk operations', 'Content calendar']
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with SOC 2 compliance and advanced data protection.',
    features: ['End-to-end encryption', 'SSO integration', 'Audit logs', 'GDPR compliance']
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with role-based permissions and workflow management.',
    features: ['User roles', 'Approval workflows', 'Team analytics', 'Shared workspaces']
  }
]

const benefits = [
  'Save 10+ hours per week on content distribution',
  'Increase reach by 500% across multiple platforms',
  'Boost engagement with AI-optimized content',
  'Scale your content strategy without hiring',
  'Track ROI with comprehensive analytics',
  'Maintain brand consistency across platforms'
]

export default function FeaturesPage() {
  return (
    <PageLayout>
      <PageHero
        title="Powerful Features for Modern Content Creators"
        description="Everything you need to create, distribute, and analyze content across 1000+ platforms worldwide."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Schedule Demo</Link>
          </Button>
        </div>
      </PageHero>

      {/* Main Features */}
      <ContentSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">Core Feature</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* Benefits Section */}
      <ContentSection background="muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose Universal Blog Platform?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of content creators who have transformed their reach and engagement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today and experience the power of AI-driven content distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/pricing">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
