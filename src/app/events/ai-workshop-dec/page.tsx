import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  Users,
  MapPin,
  Bot,
  ArrowRight,
  Video,
  Download,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Content Creation Workshop',
  description: 'Hands-on workshop to master AI-powered content creation and automation strategies.',
}

const workshopModules = [
  {
    title: 'AI Fundamentals for Content Creators',
    duration: '30 minutes',
    topics: ['Understanding AI capabilities', 'Content generation basics', 'Best practices overview']
  },
  {
    title: 'Hands-on AI Writing',
    duration: '45 minutes',
    topics: ['Prompt engineering', 'Content optimization', 'Platform-specific adaptation']
  },
  {
    title: 'Automation Strategies',
    duration: '30 minutes',
    topics: ['Workflow automation', 'Scheduling optimization', 'Performance tracking']
  },
  {
    title: 'Q&A and Troubleshooting',
    duration: '15 minutes',
    topics: ['Common challenges', 'Advanced techniques', 'Resource sharing']
  }
]

export default function AIWorkshopPage() {
  return (
    <PageLayout>
      <PageHero
        title="AI Content Creation Workshop"
        description="Master AI-powered content creation with hands-on training and practical strategies."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Event Details */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Badge className="mb-4 bg-purple-600">Workshop</Badge>
                  <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>December 18, 2024</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>10:00 AM - 12:00 PM EST</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Interactive Online Workshop</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span>Limited to 50 participants</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button size="lg" className="w-full" asChild>
                      <Link href="/events/register?event=ai-workshop-dec">
                        <Video className="mr-2 h-4 w-4" />
                        Register Now - $49
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    What You'll Master
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Advanced AI prompt engineering techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Content automation workflows</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Platform-specific AI optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Quality control and editing strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">ROI measurement for AI content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workshop Instructor */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Workshop Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/instructors/alex-chen.jpg" alt="Alex Chen" />
                  <AvatarFallback className="text-lg">AC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Alex Chen</h3>
                  <p className="text-primary font-medium mb-3">Head of AI Product, Universal Blog Platform</p>
                  <p className="text-muted-foreground mb-4">
                    Alex leads our AI development team and has 8+ years of experience in machine learning 
                    and content automation. He's helped thousands of creators optimize their workflows 
                    with AI-powered tools.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">8+</span>
                      <p className="text-muted-foreground">Years in AI</p>
                    </div>
                    <div>
                      <span className="font-medium">50+</span>
                      <p className="text-muted-foreground">Workshops Led</p>
                    </div>
                    <div>
                      <span className="font-medium">5000+</span>
                      <p className="text-muted-foreground">Creators Trained</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workshop Modules */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Workshop Agenda</CardTitle>
              <CardDescription>2 hours of intensive, hands-on AI training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workshopModules.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <Badge variant="outline">{module.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="text-sm bg-muted/50 p-2 rounded">
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">During the Workshop:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Live interactive training session</li>
                    <li>• Hands-on exercises and practice</li>
                    <li>• Real-time Q&A with instructor</li>
                    <li>• Small group breakout sessions</li>
                    <li>• Personalized feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Take-Home Resources:</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Workshop recording (30-day access)</li>
                    <li>• AI prompt template library</li>
                    <li>• Workflow automation guides</li>
                    <li>• Exclusive community access</li>
                    <li>• Follow-up email support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card className="mb-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-800">
                <p className="mb-3">To get the most out of this workshop, you should have:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Basic familiarity with content creation</li>
                  <li>• Universal Blog Platform account (free trial available)</li>
                  <li>• Stable internet connection for interactive participation</li>
                  <li>• Willingness to experiment and ask questions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Registration CTA */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Transform Your Content Creation</h2>
              <p className="mb-6 opacity-90">
                Join 50 creators for this intensive AI workshop and revolutionize your content strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/events/register?event=ai-workshop-dec">
                    <Video className="mr-2 h-4 w-4" />
                    Register Now - $49
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
                  <Link href="/events/ai-workshop-dec/syllabus">
                    <Download className="mr-2 h-4 w-4" />
                    Download Syllabus
                  </Link>
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                30-day money-back guarantee • Certificate of completion included
              </p>
            </CardContent>
          </Card>

          {/* More Events */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">More Learning Opportunities</h2>
            <p className="text-muted-foreground mb-6">
              Explore our other workshops and events to master content creation.
            </p>
            <Button variant="outline" asChild>
              <Link href="/community">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
