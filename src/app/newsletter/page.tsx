import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Mail, 
  Send, 
  CheckCircle,
  Zap,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newsletter Signup',
  description: 'Stay updated with Universal Blog Platform news, features, and content creation tips.',
}

const benefits = [
  {
    icon: Zap,
    title: 'Feature Updates',
    description: 'Be the first to know about new features and improvements'
  },
  {
    icon: Users,
    title: 'Creator Tips',
    description: 'Expert advice and best practices from successful creators'
  },
  {
    icon: Calendar,
    title: 'Weekly Digest',
    description: 'Curated content and industry insights delivered weekly'
  }
]

const newsletterTypes = [
  {
    id: 'product-updates',
    title: 'Product Updates',
    description: 'New features, improvements, and platform announcements',
    frequency: 'Weekly'
  },
  {
    id: 'creator-tips',
    title: 'Creator Tips & Insights',
    description: 'Content creation strategies, best practices, and success stories',
    frequency: 'Bi-weekly'
  },
  {
    id: 'industry-news',
    title: 'Industry News',
    description: 'Latest trends in content creation and social media',
    frequency: 'Monthly'
  },
  {
    id: 'company-news',
    title: 'Company News',
    description: 'Company updates, team news, and behind-the-scenes content',
    frequency: 'Monthly'
  }
]

export default function NewsletterPage() {
  return (
    <PageLayout>
      <PageHero
        title="Stay in the Loop"
        description="Get the latest updates, tips, and insights delivered straight to your inbox. Join thousands of creators who stay ahead of the curve."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Signup Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Subscribe to Our Newsletter
                  </CardTitle>
                  <CardDescription>
                    Choose what you'd like to receive and how often
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>

                    {/* Newsletter Preferences */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">What would you like to receive?</h3>
                      <div className="space-y-3">
                        {newsletterTypes.map((type) => (
                          <div key={type.id} className="flex items-start space-x-3">
                            <Checkbox id={type.id} defaultChecked />
                            <div className="flex-1">
                              <Label htmlFor={type.id} className="font-medium">
                                {type.title}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {type.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Frequency: {type.frequency}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="consent" required />
                        <Label htmlFor="consent" className="text-sm">
                          I agree to receive marketing emails from Universal Blog Platform. 
                          I can unsubscribe at any time. *
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox id="privacy" required />
                        <Label htmlFor="privacy" className="text-sm">
                          I have read and agree to the{' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                          . *
                        </Label>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits & Info */}
            <div className="space-y-8">
              {/* Benefits */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Why Subscribe?</h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <benefit.icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Proof */}
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">25,000+</div>
                    <p className="text-muted-foreground mb-4">
                      Content creators already subscribed
                    </p>
                    <div className="flex justify-center items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">+25,000 others</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial */}
              <Card>
                <CardContent className="p-6">
                  <blockquote className="text-lg italic mb-4">
                    "The weekly newsletter keeps me updated on all the latest features and gives me great ideas for my content strategy."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20" />
                    <div>
                      <p className="font-semibold">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Content Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Note */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">Your Privacy Matters</h3>
                      <p className="text-sm text-green-800">
                        We respect your privacy and will never share your email with third parties. 
                        You can unsubscribe at any time with one click.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Archive Link */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">Want to See What You're Missing?</h2>
            <p className="text-muted-foreground mb-6">
              Check out our newsletter archive to see the kind of content we share.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/newsletter/archive">
                View Newsletter Archive
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
