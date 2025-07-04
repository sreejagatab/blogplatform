'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Check,
  X,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Building
} from 'lucide-react'
import Link from 'next/link'

// Note: Metadata moved to layout.tsx since this is now a client component

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individual creators getting started',
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    badge: 'Free Forever',
    badgeVariant: 'secondary' as const,
    features: [
      '5 posts per month',
      '10 platform connections',
      'Basic analytics',
      'Email support',
      'Content templates',
      'Basic AI assistance'
    ],
    limitations: [
      'Limited AI features',
      'No advanced analytics',
      'No team collaboration'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Professional',
    description: 'For serious content creators and small teams',
    price: { monthly: 29, yearly: 290 },
    icon: Star,
    badge: 'Most Popular',
    badgeVariant: 'default' as const,
    features: [
      'Unlimited posts',
      '100+ platform connections',
      'Advanced analytics',
      'Priority support',
      'Custom templates',
      'Full AI suite',
      'Content scheduling',
      'SEO optimization',
      'Brand management',
      'Basic team features'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large teams and organizations',
    price: { monthly: 99, yearly: 990 },
    icon: Building,
    badge: 'Advanced',
    badgeVariant: 'outline' as const,
    features: [
      'Everything in Professional',
      '1000+ platform connections',
      'White-label solution',
      'Dedicated support',
      'Custom integrations',
      'Advanced team management',
      'API access',
      'Custom analytics',
      'SLA guarantee',
      'Training & onboarding'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
]

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
  },
  {
    question: 'What platforms are supported?',
    answer: 'We support 1000+ platforms including all major social media networks, blog platforms, and content communities.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans.'
  }
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <PageLayout>
      <PageHero
        title="Simple, Transparent Pricing"
        description="Choose the perfect plan for your content distribution needs. Start free and scale as you grow."
      />

      {/* Pricing Toggle */}
      <ContentSection className="pt-0">
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}>Monthly</span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm font-medium ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}>Yearly</span>
          <Badge variant="secondary" className="ml-2">Save 20%</Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-4 py-1">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
                
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      ${isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {isYearly && plan.price.yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed annually (${plan.price.yearly}/year)
                    </p>
                  )}
                  {!isYearly && plan.price.yearly > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      or ${plan.price.yearly}/year (save 20%)
                    </p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                  asChild
                >
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    What's included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ContentSection>

      {/* FAQ Section */}
      <ContentSection background="muted">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* CTA Section */}
      <ContentSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of content creators who trust Universal Blog Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
