"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Copy, 
  Check,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react'

interface AIContentAssistantProps {
  onContentGenerated: (content: { title: string; content: string; excerpt: string; hashtags: string[] }) => void
  currentContent?: {
    title: string
    content: string
    excerpt: string
  }
}

interface GeneratedContent {
  title: string
  content: string
  excerpt: string
  keywords: string[]
  hashtags: string[]
  suggestedImages: string[]
  metadata: {
    wordCount: number
    readingTime: number
    seoScore: number
    engagementPrediction: number
    confidence: number
  }
}

export function AIContentAssistant({ onContentGenerated, currentContent }: AIContentAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  
  // Generation form state
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState<'blog-post' | 'social-media' | 'newsletter' | 'product-description'>('blog-post')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'authoritative' | 'humorous'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [targetAudience, setTargetAudience] = useState('')
  const [keywords, setKeywords] = useState('')

  const generateContent = async () => {
    if (!topic.trim() || !targetAudience.trim()) {
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          type: contentType,
          tone,
          length,
          targetAudience,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          includeImages: true,
          includeHashtags: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      if (data.success) {
        setGeneratedContent(data.data)
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Content generation error:', error)
      // You might want to show a toast notification here
    } finally {
      setIsGenerating(false)
    }
  }

  const optimizeCurrentContent = async () => {
    if (!currentContent?.content.trim()) {
      return
    }

    setIsOptimizing(true)
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: currentContent.content,
          title: currentContent.title,
          platform: 'blog',
          targetAudience: targetAudience || 'general audience',
          tone,
          includeHashtags: true,
          includeSEO: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to optimize content')
      }

      const data = await response.json()
      if (data.success) {
        // Create optimized content structure
        const optimizedContent: GeneratedContent = {
          title: currentContent.title,
          content: data.data.optimizedContent,
          excerpt: currentContent.excerpt,
          keywords: [],
          hashtags: data.data.hashtags || [],
          suggestedImages: [],
          metadata: {
            wordCount: data.data.optimizedContent.split(' ').length,
            readingTime: Math.ceil(data.data.optimizedContent.split(' ').length / 200),
            seoScore: data.data.seoScore || 0,
            engagementPrediction: data.data.engagementPrediction || 0,
            confidence: 85
          }
        }
        setGeneratedContent(optimizedContent)
      } else {
        throw new Error(data.error || 'Optimization failed')
      }
    } catch (error) {
      console.error('Content optimization error:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const useGeneratedContent = () => {
    if (generatedContent) {
      onContentGenerated({
        title: generatedContent.title,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        hashtags: generatedContent.hashtags
      })
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Content Assistant
        </CardTitle>
        <CardDescription>
          Generate new content or optimize existing content with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Generation Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <h3 className="font-semibold">Generate New Content</h3>
          </div>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., React Performance Optimization"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="product-description">Product Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="length">Length</Label>
              <Select value={length} onValueChange={(value: any) => setLength(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (300-500 words)</SelectItem>
                  <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                  <SelectItem value="long">Long (1500-2500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Frontend developers, beginners"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                placeholder="e.g., React, performance, optimization"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={generateContent} 
            disabled={isGenerating || !topic.trim() || !targetAudience.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </div>

        {/* Content Optimization Section */}
        {currentContent?.content && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold">Optimize Current Content</h3>
            </div>
            
            <Button 
              onClick={optimizeCurrentContent} 
              disabled={isOptimizing}
              variant="outline"
              className="w-full"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Optimize Content
                </>
              )}
            </Button>
          </div>
        )}

        {/* Generated Content Display */}
        {generatedContent && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generated Content</h3>
              <Button onClick={useGeneratedContent} size="sm">
                Use This Content
              </Button>
            </div>
            
            {/* Content Metrics */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words:</span>
                <span>{generatedContent.metadata.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reading Time:</span>
                <span>{generatedContent.metadata.readingTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SEO Score:</span>
                <Badge variant={generatedContent.metadata.seoScore > 80 ? 'default' : 'secondary'}>
                  {generatedContent.metadata.seoScore}/100
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement:</span>
                <Badge variant={generatedContent.metadata.engagementPrediction > 70 ? 'default' : 'secondary'}>
                  {generatedContent.metadata.engagementPrediction}%
                </Badge>
              </div>
            </div>
            
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Title</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedContent.title, 'title')}
                >
                  {copied === 'title' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md text-sm">
                {generatedContent.title}
              </div>
            </div>
            
            {/* Hashtags */}
            {generatedContent.hashtags.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Hashtags</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{hashtag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
