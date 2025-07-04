import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Download, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Users, 
  Target,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Workshop Syllabus',
  description: 'Detailed syllabus for the AI Content Creation Workshop.',
}

const modules = [
  {
    title: 'Module 1: AI Fundamentals for Content Creators',
    duration: '30 minutes',
    objectives: [
      'Understand the basics of AI and machine learning',
      'Learn about different types of AI content tools',
      'Identify opportunities for AI in your workflow',
      'Recognize limitations and best practices'
    ],
    topics: [
      'Introduction to AI content generation',
      'Overview of popular AI tools and platforms',
      'Understanding AI capabilities and limitations',
      'Setting realistic expectations for AI assistance'
    ],
    activities: [
      'Interactive AI tool demonstration',
      'Group discussion on current content challenges',
      'Hands-on exploration of AI writing assistants'
    ]
  },
  {
    title: 'Module 2: Hands-on AI Writing',
    duration: '45 minutes',
    objectives: [
      'Master the art of prompt engineering',
      'Learn content optimization techniques',
      'Adapt content for different platforms',
      'Develop a personal AI writing workflow'
    ],
    topics: [
      'Prompt engineering fundamentals',
      'Creating effective content briefs for AI',
      'Editing and refining AI-generated content',
      'Platform-specific content adaptation',
      'Maintaining brand voice with AI assistance'
    ],
    activities: [
      'Live prompt engineering workshop',
      'Content creation exercise using AI tools',
      'Peer review and feedback session',
      'Platform adaptation challenge'
    ]
  },
  {
    title: 'Module 3: Automation Strategies',
    duration: '30 minutes',
    objectives: [
      'Design efficient content workflows',
      'Implement scheduling and automation',
      'Track performance and optimize',
      'Scale content production effectively'
    ],
    topics: [
      'Workflow design and optimization',
      'Content scheduling strategies',
      'Performance tracking and analytics',
      'Scaling content production',
      'Quality control in automated workflows'
    ],
    activities: [
      'Workflow mapping exercise',
      'Automation tool setup demonstration',
      'Performance metrics analysis',
      'Scaling strategy planning'
    ]
  },
  {
    title: 'Module 4: Q&A and Troubleshooting',
    duration: '15 minutes',
    objectives: [
      'Address common AI content challenges',
      'Share advanced techniques and tips',
      'Provide resources for continued learning',
      'Build community connections'
    ],
    topics: [
      'Common pitfalls and how to avoid them',
      'Advanced AI techniques and strategies',
      'Resource recommendations',
      'Community building and networking'
    ],
    activities: [
      'Open Q&A session',
      'Problem-solving workshop',
      'Resource sharing',
      'Networking and community building'
    ]
  }
]

const prerequisites = [
  'Basic familiarity with content creation',
  'Universal Blog Platform account (free trial available)',
  'Stable internet connection for interactive participation',
  'Willingness to experiment and ask questions',
  'Basic understanding of social media platforms'
]

const materials = [
  'Workshop slides and presentation materials',
  'AI prompt template library (50+ templates)',
  'Content workflow templates',
  'Platform-specific optimization guides',
  'Resource list with recommended tools and readings',
  'Community access invitation'
]

const outcomes = [
  'Confidently use AI tools for content creation',
  'Develop effective prompts for various content types',
  'Create automated content workflows',
  'Optimize content for multiple platforms simultaneously',
  'Measure and improve AI content performance',
  'Build a sustainable, scalable content strategy'
]

export default function AIWorkshopSyllabusPage() {
  return (
    <PageLayout>
      <PageHero
        title="AI Content Creation Workshop"
        description="Detailed syllabus and learning objectives for the comprehensive AI workshop."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/events/ai-workshop-dec">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Workshop Details
              </Link>
            </Button>
          </div>

          {/* Workshop Overview */}
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Workshop Syllabus
                  </CardTitle>
                  <CardDescription>
                    Comprehensive 2-hour intensive training program
                  </CardDescription>
                </div>
                <Badge className="bg-purple-600">Premium Workshop</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Duration</h3>
                  <p className="text-sm text-muted-foreground">2 Hours Intensive</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Format</h3>
                  <p className="text-sm text-muted-foreground">Interactive Online</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Level</h3>
                  <p className="text-sm text-muted-foreground">Beginner to Advanced</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Learning Outcomes</CardTitle>
              <CardDescription>What you'll achieve by the end of this workshop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{outcome}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Modules */}
          <div className="space-y-8 mb-12">
            <h2 className="text-3xl font-bold text-center">Workshop Modules</h2>
            {modules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <Badge variant="outline">{module.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Learning Objectives</h4>
                    <ul className="space-y-2">
                      {module.objectives.map((objective, objIndex) => (
                        <li key={objIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Topics Covered</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="text-sm bg-muted/50 p-2 rounded">
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Interactive Activities</h4>
                    <ul className="space-y-1">
                      {module.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-muted-foreground">
                          • {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Prerequisites */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>What you need to get the most out of this workshop</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {prerequisite}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Materials Included */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Materials Included</CardTitle>
              <CardDescription>Resources you'll receive with your registration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Download className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{material}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download and Register */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Content Creation?</h2>
              <p className="mb-6 opacity-90">
                Download the full syllabus or register now to secure your spot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/events/register?event=ai-workshop-dec">
                    Register Now - $49
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                  asChild
                >
                  <a href="/docs/ai-workshop-syllabus.pdf" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Syllabus
                  </a>
                </Button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                30-day money-back guarantee • Certificate of completion included
              </p>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
