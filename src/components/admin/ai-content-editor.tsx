'use client'

import { useState, useCallback } from 'react'
import { 
  Sparkles,
  Wand2,
  Brain,
  Target,
  TrendingUp,
  Hash,
  Eye,
  Save,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface AIContentEditorProps {
  initialContent?: string
  onSave?: (content: string, metadata: any) => void
  onPublish?: (content: string, metadata: any) => void
}

interface AIAssistance {
  type: 'suggestion' | 'optimization' | 'seo' | 'engagement'
  title: string
  description: string
  action: string
  confidence: number
}

interface ContentAnalysis {
  readabilityScore: number
  seoScore: number
  engagementPotential: number
  wordCount: number
  readingTime: number
  suggestions: AIAssistance[]
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

export default function AIContentEditor({ 
  initialContent = '', 
  onSave, 
  onPublish 
}: AIContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn'])
  const [aiMode, setAiMode] = useState<'assist' | 'optimize' | 'generate'>('assist')

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', color: 'bg-sky-500' },
    { id: 'medium', name: 'Medium', color: 'bg-green-600' },
    { id: 'devto', name: 'Dev.to', color: 'bg-gray-900' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-700' }
  ]

  const analyzeContent = useCallback(async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockAnalysis: ContentAnalysis = {
      readabilityScore: Math.floor(Math.random() * 30) + 70,
      seoScore: Math.floor(Math.random() * 25) + 75,
      engagementPotential: Math.floor(Math.random() * 20) + 80,
      wordCount: content.split(' ').length,
      readingTime: Math.ceil(content.split(' ').length / 200),
      sentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
      keywords: ['web development', 'technology', 'programming', 'AI', 'innovation'],
      suggestions: [
        {
          type: 'seo',
          title: 'Add more keywords',
          description: 'Include trending keywords to improve discoverability',
          action: 'Add keywords like "machine learning" and "automation"',
          confidence: 85
        },
        {
          type: 'engagement',
          title: 'Add call-to-action',
          description: 'Encourage reader interaction with a clear CTA',
          action: 'Add "What are your thoughts?" at the end',
          confidence: 92
        },
        {
          type: 'optimization',
          title: 'Improve readability',
          description: 'Break down long paragraphs for better readability',
          action: 'Split the third paragraph into two shorter ones',
          confidence: 78
        }
      ]
    }
    
    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }, [content])

  const generateContent = async (prompt: string) => {
    setIsGenerating(true)
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const generatedContent = `# ${title || 'AI-Generated Content'}

This is AI-generated content based on your prompt: "${prompt}"

## Introduction

Artificial Intelligence is revolutionizing the way we create and consume content. With advanced language models, we can now generate high-quality, engaging content that resonates with audiences across different platforms.

## Key Benefits

1. **Efficiency**: Generate content 10x faster than traditional methods
2. **Consistency**: Maintain brand voice across all platforms
3. **Optimization**: Automatically optimize for each platform's requirements
4. **Personalization**: Tailor content for specific audience segments

## Platform-Specific Adaptations

${selectedPlatforms.map(platform => `
### ${platform}
- Optimized for ${platform}'s audience and format
- Includes platform-specific hashtags and mentions
- Follows ${platform}'s best practices for engagement
`).join('')}

## Conclusion

The future of content creation lies in the seamless integration of human creativity and AI assistance. By leveraging these tools, content creators can focus on strategy and storytelling while AI handles optimization and adaptation.

What are your thoughts on AI-powered content creation? Share your experiences in the comments below!

#AI #ContentCreation #DigitalMarketing #Technology`

    setContent(generatedContent)
    setIsGenerating(false)
    
    // Auto-analyze the generated content
    setTimeout(analyzeContent, 500)
  }

  const optimizeForPlatform = async (platform: string) => {
    setIsGenerating(true)
    
    // Simulate platform optimization
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let optimizedContent = content
    
    switch (platform) {
      case 'twitter':
        optimizedContent = content.substring(0, 280) + '...\n\n🧵 Thread continues below'
        break
      case 'linkedin':
        optimizedContent = content + '\n\n#ProfessionalDevelopment #Innovation #Technology'
        break
      case 'medium':
        optimizedContent = '# ' + title + '\n\n' + content + '\n\n---\n\n*Thank you for reading! Follow for more insights.*'
        break
    }
    
    setContent(optimizedContent)
    setIsGenerating(false)
  }

  const applySuggestion = (suggestion: AIAssistance) => {
    // Simulate applying AI suggestion
    let updatedContent = content
    
    switch (suggestion.type) {
      case 'seo':
        updatedContent += '\n\n#MachineLearning #Automation #TechTrends'
        break
      case 'engagement':
        updatedContent += '\n\nWhat are your thoughts on this topic? Share your experiences in the comments!'
        break
      case 'optimization':
        // Simple paragraph splitting simulation
        updatedContent = content.replace(/\. ([A-Z])/g, '.\n\n$1')
        break
    }
    
    setContent(updatedContent)
    
    // Remove applied suggestion
    if (analysis) {
      setAnalysis({
        ...analysis,
        suggestions: analysis.suggestions.filter(s => s !== suggestion)
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI-Powered Content Editor
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant={aiMode === 'assist' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiMode('assist')}
              >
                <Brain className="h-4 w-4 mr-1" />
                Assist
              </Button>
              <Button
                variant={aiMode === 'optimize' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiMode('optimize')}
              >
                <Target className="h-4 w-4 mr-1" />
                Optimize
              </Button>
              <Button
                variant={aiMode === 'generate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiMode('generate')}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Enter your content title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium"
            />

            {/* Platform Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Target Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {platforms.map(platform => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatforms.includes(platform.name) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes(platform.name)
                          ? prev.filter(p => p !== platform.name)
                          : [...prev, platform.name]
                      )
                    }}
                  >
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* AI Generation Panel */}
        {aiMode === 'generate' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Content Generation
            </h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe what you want to write about..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={() => generateContent('AI and technology trends')}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Content Editor */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Content Editor
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeContent}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                Analyze
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your amazing content..."
            className="min-h-[400px] font-mono text-sm"
          />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {content.split(' ').length} words • {Math.ceil(content.split(' ').length / 200)} min read
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onSave?.(content, { title, platforms: selectedPlatforms })}>
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
              <Button onClick={() => onPublish?.(content, { title, platforms: selectedPlatforms })}>
                <Send className="h-4 w-4 mr-1" />
                Publish
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Assistant Sidebar */}
      <div className="space-y-6">
        {/* Content Analysis */}
        {analysis && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content Analysis
            </h3>
            
            <div className="space-y-4">
              {/* Scores */}
              <div className="grid grid-cols-1 gap-3">
                <div className={`p-3 rounded-lg ${getScoreBg(analysis.readabilityScore)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Readability</span>
                    <span className={`font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                      {analysis.readabilityScore}%
                    </span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${getScoreBg(analysis.seoScore)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SEO Score</span>
                    <span className={`font-bold ${getScoreColor(analysis.seoScore)}`}>
                      {analysis.seoScore}%
                    </span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${getScoreBg(analysis.engagementPotential)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Engagement</span>
                    <span className={`font-bold ${getScoreColor(analysis.engagementPotential)}`}>
                      {analysis.engagementPotential}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Detected Keywords
                </h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sentiment */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sentiment:
                </span>
                <Badge 
                  className={
                    analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    analysis.sentiment === 'neutral' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {analysis.sentiment}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* AI Suggestions */}
        {analysis?.suggestions && analysis.suggestions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Suggestions
            </h3>
            
            <div className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {suggestion.type === 'seo' && <Hash className="h-4 w-4 text-blue-600" />}
                      {suggestion.type === 'engagement' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {suggestion.type === 'optimization' && <Zap className="h-4 w-4 text-purple-600" />}
                      <span className="text-sm font-medium">{suggestion.title}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {suggestion.action}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Platform Optimization */}
        {aiMode === 'optimize' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Platform Optimization
            </h3>
            
            <div className="space-y-3">
              {selectedPlatforms.map(platform => (
                <Button
                  key={platform}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => optimizeForPlatform(platform.toLowerCase())}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Optimize for {platform}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => generateContent('Generate content ideas for the current topic')}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Ideas
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => generateContent('Suggest relevant hashtags for this content')}
            >
              <Hash className="h-4 w-4 mr-2" />
              Suggest Hashtags
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => generateContent('Analyze current trends related to this topic')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Check Trends
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => generateContent('Analyze target audience for this content')}
            >
              <Target className="h-4 w-4 mr-2" />
              Audience Analysis
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
