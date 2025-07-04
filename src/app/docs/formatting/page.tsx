import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Type, 
  Hash, 
  Link as LinkIcon,
  List,
  ArrowRight,
  CheckCircle,
  Code,
  Palette
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Platform-Specific Formatting',
  description: 'Learn how to format content optimally for each social media and blog platform.',
}

const platformFormats = [
  {
    platform: 'Twitter/X',
    icon: Hash,
    limits: { characters: 280, images: 4, videos: 1 },
    formatting: [
      'Use hashtags strategically (2-3 max)',
      'Mention users with @username',
      'Break long content into threads',
      'Use emojis for engagement'
    ],
    tips: [
      'Front-load important information',
      'Include call-to-action in first tweet',
      'Use line breaks for readability',
      'Add images to increase engagement'
    ]
  },
  {
    platform: 'LinkedIn',
    icon: Type,
    limits: { characters: 3000, images: 9, videos: 1 },
    formatting: [
      'Professional tone and language',
      'Use bullet points for lists',
      'Include industry hashtags',
      'Tag relevant companies/people'
    ],
    tips: [
      'Start with a hook in first line',
      'Use white space effectively',
      'Include personal insights',
      'End with a question for engagement'
    ]
  },
  {
    platform: 'Instagram',
    icon: Palette,
    limits: { characters: 2200, images: 10, videos: 1 },
    formatting: [
      'Visual-first content approach',
      'Use relevant hashtags (5-10)',
      'Include location tags',
      'Mention collaborators'
    ],
    tips: [
      'Tell a story with your caption',
      'Use emojis as bullet points',
      'Include call-to-action',
      'Engage with comments quickly'
    ]
  }
]

const formattingElements = [
  {
    element: 'Headlines',
    description: 'Craft compelling titles that grab attention',
    examples: [
      'How to [achieve goal] in [timeframe]',
      '[Number] [adjective] ways to [benefit]',
      'The ultimate guide to [topic]',
      'Why [statement] and what to do about it'
    ]
  },
  {
    element: 'Hashtags',
    description: 'Use platform-appropriate hashtags for discovery',
    examples: [
      'Twitter: 1-2 hashtags max',
      'Instagram: 5-10 relevant hashtags',
      'LinkedIn: 3-5 professional hashtags',
      'TikTok: Mix trending and niche hashtags'
    ]
  },
  {
    element: 'Call-to-Actions',
    description: 'Guide your audience to take specific actions',
    examples: [
      'What do you think? Share in comments',
      'Save this post for later reference',
      'Follow for more [topic] tips',
      'Click the link in bio to learn more'
    ]
  }
]

export default function FormattingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Platform-Specific Formatting"
        description="Master the art of formatting content for maximum impact on each platform."
        size="md"
      />

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Reference */}
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Formatting Quick Reference
              </CardTitle>
              <CardDescription>
                Essential formatting guidelines for each platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg">
                  <h3 className="font-semibold mb-2">Twitter/X</h3>
                  <p>280 chars • 2-3 hashtags • Visual content</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <h3 className="font-semibold mb-2">LinkedIn</h3>
                  <p>3000 chars • Professional tone • Industry hashtags</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <p>2200 chars • 5-10 hashtags • Story-driven</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform-Specific Guidelines */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Platform-Specific Guidelines</h2>
            <div className="space-y-8">
              {platformFormats.map((platform, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <platform.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{platform.platform}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{platform.limits.characters} chars</Badge>
                        <Badge variant="outline">{platform.limits.images} images</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Formatting Rules:</h4>
                        <ul className="space-y-2">
                          {platform.formatting.map((rule, ruleIndex) => (
                            <li key={ruleIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {platform.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Formatting Elements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Key Formatting Elements</h2>
            <div className="space-y-6">
              {formattingElements.map((element, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{element.element}</CardTitle>
                    <CardDescription>{element.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {element.examples.map((example, exampleIndex) => (
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

          {/* Formatting Tools */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Built-in Formatting Tools</CardTitle>
              <CardDescription>
                Use our tools to format content automatically for each platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Code className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Auto-Formatting</h3>
                  <p className="text-sm text-muted-foreground">Automatically format content for each platform's requirements</p>
                </div>
                <div className="text-center">
                  <Hash className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Hashtag Suggestions</h3>
                  <p className="text-sm text-muted-foreground">Get relevant hashtag recommendations for better reach</p>
                </div>
                <div className="text-center">
                  <Type className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Character Counter</h3>
                  <p className="text-sm text-muted-foreground">Real-time character counting for each platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle>Universal Formatting Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✅ Do</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Adapt content for each platform's audience</li>
                    <li>• Use platform-native features</li>
                    <li>• Include relevant hashtags and mentions</li>
                    <li>• Optimize for mobile viewing</li>
                    <li>• Test different formats and styles</li>
                    <li>• Include clear call-to-actions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">❌ Don't</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Use identical formatting everywhere</li>
                    <li>• Ignore character limits</li>
                    <li>• Overuse hashtags or mentions</li>
                    <li>• Forget to proofread content</li>
                    <li>• Use inappropriate tone for platform</li>
                    <li>• Neglect visual formatting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Master Platform Formatting</h2>
            <p className="text-muted-foreground mb-6">
              Use our formatting tools to optimize your content for each platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Type className="mr-2 h-4 w-4" />
                Try Formatting Tools
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/publishing">
                  Learn About Publishing
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
