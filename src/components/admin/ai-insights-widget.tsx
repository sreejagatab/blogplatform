"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  BarChart3,
  RefreshCw,
  Sparkles
} from 'lucide-react'

interface AIInsight {
  type: 'content_suggestion' | 'optimization_tip' | 'trend_alert' | 'performance_prediction'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  estimatedImpact?: number
}

interface AIInsightsData {
  contentSuggestions: Array<{
    title: string
    topic: string
    reasoning: string
    trendScore: number
    difficulty: 'easy' | 'medium' | 'hard'
  }>
  optimizationTips: Array<{
    area: string
    suggestion: string
    impact: 'high' | 'medium' | 'low'
    implementation: string
  }>
  performancePrediction: {
    expectedViews: number
    expectedEngagement: number
    viralPotential: number
    bestPerformingPlatforms: string[]
  }
}

export function AIInsightsWidget() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAIInsights = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/ai/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeframe: '30d',
          includeContentRecommendations: true,
          includeAudienceInsights: true,
          includePerformancePrediction: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights')
      }

      const data = await response.json()
      
      if (data.success) {
        const processedInsights = processAIData(data.data)
        setInsights(processedInsights)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error)
      setError(error instanceof Error ? error.message : 'Failed to load insights')
    } finally {
      setIsLoading(false)
    }
  }

  const processAIData = (data: any): AIInsight[] => {
    const insights: AIInsight[] = []

    // Process content suggestions
    if (data.aiInsights?.contentSuggestions) {
      data.aiInsights.contentSuggestions.slice(0, 2).forEach((suggestion: any) => {
        insights.push({
          type: 'content_suggestion',
          title: suggestion.title,
          description: suggestion.reasoning,
          priority: suggestion.trendScore > 85 ? 'high' : suggestion.trendScore > 70 ? 'medium' : 'low',
          actionable: true,
          estimatedImpact: suggestion.trendScore
        })
      })
    }

    // Process optimization tips
    if (data.aiInsights?.optimizationTips) {
      data.aiInsights.optimizationTips.slice(0, 2).forEach((tip: any) => {
        insights.push({
          type: 'optimization_tip',
          title: `${tip.area.charAt(0).toUpperCase() + tip.area.slice(1)} Optimization`,
          description: tip.suggestion,
          priority: tip.impact,
          actionable: true
        })
      })
    }

    // Process performance predictions
    if (data.predictiveAnalytics?.contentPerformancePrediction) {
      const prediction = data.predictiveAnalytics.contentPerformancePrediction
      insights.push({
        type: 'performance_prediction',
        title: 'Content Performance Forecast',
        description: `Next post expected to reach ${prediction.expectedViews.toLocaleString()} views with ${prediction.expectedEngagement}% engagement`,
        priority: prediction.viralPotential > 50 ? 'high' : 'medium',
        actionable: false,
        estimatedImpact: prediction.viralPotential
      })
    }

    return insights.slice(0, 4) // Limit to 4 insights for the widget
  }

  useEffect(() => {
    fetchAIInsights()
  }, [])

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'content_suggestion':
        return <Lightbulb className="h-4 w-4" />
      case 'optimization_tip':
        return <Target className="h-4 w-4" />
      case 'trend_alert':
        return <TrendingUp className="h-4 w-4" />
      case 'performance_prediction':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
          <CardDescription>
            AI-powered recommendations and predictions
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAIInsights}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchAIInsights}>
              Try Again
            </Button>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-4">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No insights available yet. Create more content to get AI recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                {insight.estimatedImpact && (
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      {insight.estimatedImpact}% impact
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {lastUpdated && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
