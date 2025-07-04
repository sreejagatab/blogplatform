'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Loader2,
  Copy,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface SEOAnalysis {
  score: number
  titleAnalysis: {
    score: number
    length: number
    hasKeywords: boolean
    suggestions: string[]
  }
  metaDescription: {
    score: number
    length: number
    hasKeywords: boolean
    suggestions: string[]
  }
  contentAnalysis: {
    score: number
    keywordDensity: number
    readabilityScore: number
    headingStructure: boolean
    suggestions: string[]
  }
  keywords: {
    primary: string[]
    secondary: string[]
    longtail: string[]
    suggestions: string[]
  }
  recommendations: string[]
}

interface SEOOptimizerProps {
  title: string
  content: string
  metaDescription?: string
  onOptimizedContent?: (optimized: {
    title: string
    content: string
    metaDescription: string
    keywords: string[]
  }) => void
}

export default function SEOOptimizer({ 
  title, 
  content, 
  metaDescription = '',
  onOptimizedContent 
}: SEOOptimizerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [targetKeywords, setTargetKeywords] = useState('')
  const [optimizedTitle, setOptimizedTitle] = useState(title)
  const [optimizedContent, setOptimizedContent] = useState(content)
  const [optimizedMeta, setOptimizedMeta] = useState(metaDescription)

  const analyzeSEO = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/seo-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: optimizedTitle,
          content: optimizedContent,
          metaDescription: optimizedMeta,
          targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(Boolean)
        })
      })

      if (!response.ok) throw new Error('SEO analysis failed')

      const result = await response.json()
      setAnalysis(result.data)
      toast.success('SEO analysis completed')
    } catch (error) {
      console.error('SEO analysis error:', error)
      toast.error('Failed to analyze SEO')
    } finally {
      setLoading(false)
    }
  }

  const optimizeContent = async () => {
    setOptimizing(true)
    try {
      const response = await fetch('/api/ai/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: optimizedTitle,
          content: optimizedContent,
          metaDescription: optimizedMeta,
          targetKeywords: targetKeywords.split(',').map(k => k.trim()).filter(Boolean),
          goals: ['seo', 'readability', 'engagement']
        })
      })

      if (!response.ok) throw new Error('SEO optimization failed')

      const result = await response.json()
      
      setOptimizedTitle(result.data.optimizedTitle || optimizedTitle)
      setOptimizedContent(result.data.optimizedContent || optimizedContent)
      setOptimizedMeta(result.data.optimizedMetaDescription || optimizedMeta)
      
      // Re-analyze after optimization
      await analyzeSEO()
      
      toast.success('Content optimized for SEO')
      
      // Callback with optimized content
      if (onOptimizedContent) {
        onOptimizedContent({
          title: result.data.optimizedTitle || optimizedTitle,
          content: result.data.optimizedContent || optimizedContent,
          metaDescription: result.data.optimizedMetaDescription || optimizedMeta,
          keywords: result.data.keywords || []
        })
      }
    } catch (error) {
      console.error('SEO optimization error:', error)
      toast.error('Failed to optimize content')
    } finally {
      setOptimizing(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* Target Keywords Input */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Target Keywords</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter target keywords (comma-separated)"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              className="flex-1"
            />
            <Button onClick={analyzeSEO} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Analyze SEO
            </Button>
          </div>
        </div>
      </Card>

      {/* SEO Analysis Results */}
      {analysis && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">SEO Score</h3>
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </div>
              <Progress value={analysis.score} className="mt-2 max-w-xs mx-auto" />
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Title Analysis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Title</span>
                  <Badge className={getScoreBadgeColor(analysis.titleAnalysis.score)}>
                    {analysis.titleAnalysis.score}/100
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Length: {analysis.titleAnalysis.length} chars</div>
                  <div className="flex items-center gap-1">
                    {analysis.titleAnalysis.hasKeywords ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    )}
                    Keywords included
                  </div>
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Meta Description</span>
                  <Badge className={getScoreBadgeColor(analysis.metaDescription.score)}>
                    {analysis.metaDescription.score}/100
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Length: {analysis.metaDescription.length} chars</div>
                  <div className="flex items-center gap-1">
                    {analysis.metaDescription.hasKeywords ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    )}
                    Keywords included
                  </div>
                </div>
              </div>

              {/* Content Analysis */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Content</span>
                  <Badge className={getScoreBadgeColor(analysis.contentAnalysis.score)}>
                    {analysis.contentAnalysis.score}/100
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Keyword density: {analysis.contentAnalysis.keywordDensity}%</div>
                  <div>Readability: {analysis.contentAnalysis.readabilityScore}/100</div>
                  <div className="flex items-center gap-1">
                    {analysis.contentAnalysis.headingStructure ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-600" />
                    )}
                    Heading structure
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Detected Keywords
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-green-600">Primary: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.keywords.primary.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-600">Secondary: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.keywords.secondary.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={optimizeContent} disabled={optimizing} className="flex-1">
                {optimizing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Optimize Content
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(JSON.stringify(analysis, null, 2), 'SEO Analysis')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Optimized Content Preview */}
      {(optimizedTitle !== title || optimizedContent !== content || optimizedMeta !== metaDescription) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Optimized Content
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Optimized Title:</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                {optimizedTitle}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Optimized Meta Description:</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                {optimizedMeta}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content Changes:</label>
              <div className="mt-1 p-2 bg-gray-50 rounded border text-sm max-h-32 overflow-y-auto">
                {optimizedContent.substring(0, 200)}...
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
