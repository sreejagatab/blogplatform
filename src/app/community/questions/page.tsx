import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Clock,
  User,
  CheckCircle,
  ArrowRight,
  Filter
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Community Questions',
  description: 'Ask questions and get answers from the Universal Blog Platform community.',
}

const questions = [
  {
    id: 1,
    title: 'How do I optimize my content for better engagement?',
    content: 'I\'ve been using the platform for a few months but my engagement rates are still low. What are some best practices for creating content that performs well across multiple platforms?',
    author: 'Sarah Chen',
    authorAvatar: '/avatars/sarah.jpg',
    category: 'Content Strategy',
    votes: 15,
    answers: 8,
    views: 234,
    timeAgo: '2 hours ago',
    tags: ['engagement', 'content-strategy', 'optimization'],
    solved: false
  },
  {
    id: 2,
    title: 'Best practices for scheduling posts across time zones?',
    content: 'My audience is global and I want to make sure my content reaches everyone at optimal times. How should I approach scheduling for different time zones?',
    author: 'Mike Rodriguez',
    authorAvatar: '/avatars/mike.jpg',
    category: 'Publishing',
    votes: 23,
    answers: 12,
    views: 456,
    timeAgo: '4 hours ago',
    tags: ['scheduling', 'time-zones', 'global-audience'],
    solved: true
  },
  {
    id: 3,
    title: 'AI writing assistant not generating relevant content',
    content: 'The AI suggestions don\'t seem to match my brand voice. Is there a way to train it or provide better prompts to get more relevant content suggestions?',
    author: 'Emma Thompson',
    authorAvatar: '/avatars/emma.jpg',
    category: 'AI Tools',
    votes: 31,
    answers: 15,
    views: 678,
    timeAgo: '6 hours ago',
    tags: ['ai-writing', 'brand-voice', 'prompts'],
    solved: false
  },
  {
    id: 4,
    title: 'Team collaboration workflow setup',
    content: 'We have a team of 5 content creators and need to set up an approval workflow. What\'s the best way to organize roles and permissions for efficient collaboration?',
    author: 'David Park',
    authorAvatar: '/avatars/david.jpg',
    category: 'Team Management',
    votes: 18,
    answers: 9,
    views: 345,
    timeAgo: '8 hours ago',
    tags: ['team-collaboration', 'workflows', 'permissions'],
    solved: true
  },
  {
    id: 5,
    title: 'Analytics data not updating in real-time',
    content: 'I notice there\'s a delay in analytics data. Is this normal? How often does the platform sync with social media platforms for updated metrics?',
    author: 'Lisa Wang',
    authorAvatar: '/avatars/lisa.jpg',
    category: 'Analytics',
    votes: 12,
    answers: 6,
    views: 189,
    timeAgo: '12 hours ago',
    tags: ['analytics', 'real-time', 'data-sync'],
    solved: false
  }
]

const categories = [
  { name: 'All Questions', count: 156 },
  { name: 'Content Strategy', count: 45 },
  { name: 'Publishing', count: 32 },
  { name: 'AI Tools', count: 28 },
  { name: 'Team Management', count: 21 },
  { name: 'Analytics', count: 18 },
  { name: 'Technical Issues', count: 12 }
]

export default function CommunityQuestionsPage() {
  return (
    <PageLayout>
      <PageHero
        title="Community Questions"
        description="Ask questions, share knowledge, and get help from fellow Universal Blog Platform users."
        size="md"
      >
        <div className="max-w-2xl mx-auto mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search questions and answers..." 
              className="pl-10 h-12"
            />
          </div>
        </div>
      </PageHero>

      <ContentSection className="pt-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Ask a Question</CardTitle>
                  <CardDescription>
                    Get help from the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Ask Question
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category, index) => (
                      <Button
                        key={index}
                        variant={index === 0 ? 'secondary' : 'ghost'}
                        className="w-full justify-between"
                      >
                        <span>{category.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">Recent Questions</h2>
                  <Badge variant="outline">{questions.length} questions</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort: Recent
                  </Button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Vote Section */}
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{question.votes}</span>
                          <span className="text-xs text-muted-foreground">votes</span>
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                          <div className={`flex items-center justify-center w-8 h-8 rounded ${
                            question.solved ? 'bg-green-100 text-green-600' : 'bg-muted'
                          }`}>
                            {question.solved ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <MessageCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{question.answers}</span>
                          <span className="text-xs text-muted-foreground">answers</span>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                              {question.title}
                            </h3>
                            {question.solved && (
                              <Badge className="bg-green-100 text-green-800">Solved</Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {question.content}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {question.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{question.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{question.timeAgo}</span>
                              </div>
                              <span>{question.views} views</span>
                            </div>
                            <Badge variant="outline">{question.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Questions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Community Guidelines</CardTitle>
              <CardDescription className="text-blue-700">
                Help us maintain a helpful and respectful community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
                <div>
                  <h4 className="font-semibold mb-2">Before Asking</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Search existing questions first</li>
                    <li>• Check the documentation</li>
                    <li>• Be specific and provide context</li>
                    <li>• Include relevant details and screenshots</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When Answering</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Be helpful and constructive</li>
                    <li>• Provide step-by-step instructions</li>
                    <li>• Include examples when possible</li>
                    <li>• Mark the best answer as solved</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
