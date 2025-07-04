"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Clock,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalPosts: number
    avgPerformance: {
      views: number
      likes: number
      comments: number
      engagement: number
    }
    topPerformingContent: Array<{
      id: string
      title: string
      views: number
      likes: number
      comments: number
      publishedAt: string
    }>
    improvementAreas: string[]
  }
  predictiveAnalytics: {
    contentPerformancePrediction: {
      expectedViews: number
      expectedEngagement: number
      viralPotential: number
      bestPerformingPlatforms: string[]
    }
    audienceInsights: {
      optimalPostingTimes: string[]
      preferredContentTypes: string[]
      engagementPatterns: Record<string, number>
    }
    contentRecommendations: Array<{
      topic: string
      reason: string
      priority: 'high' | 'medium' | 'low'
      estimatedImpact: number
    }>
  }
  performanceInsights: Array<{
    type: string
    insight: string
    recommendation: string
  }>
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/ai/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeframe,
          includeContentRecommendations: true,
          includeAudienceInsights: true,
          includePerformancePrediction: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()

      if (data.success) {
        setAnalyticsData(data.data)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError(error instanceof Error ? error.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
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
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchAnalytics}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!analyticsData) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.avgPerformance.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.avgPerformance.likes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.avgPerformance.comments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.summary.avgPerformance.engagement}%</div>
            <p className="text-xs text-muted-foreground">average</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Recommendations and Performance Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Content Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              AI Content Recommendations
            </CardTitle>
            <CardDescription>
              AI-suggested topics based on trends and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analyticsData.predictiveAnalytics.contentRecommendations || []).slice(0, 3).map((recommendation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{recommendation.topic}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(recommendation.priority)}`}
                    >
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {recommendation.reason}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      {recommendation.estimatedImpact}% estimated impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Data-driven insights about your content performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analyticsData.performanceInsights || []).slice(0, 3).map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium text-sm">{insight.type.replace('_', ' ').toUpperCase()}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {insight.insight}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    💡 {insight.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>
            Your best performing posts in the selected timeframe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(analyticsData.summary.topPerformingContent || []).map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{post.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Published {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Audience Insights
          </CardTitle>
          <CardDescription>
            Understanding your audience behavior and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Optimal Posting Times
              </h4>
              <div className="space-y-2">
                {(analyticsData.predictiveAnalytics.audienceInsights.optimalPostingTimes || []).map((time, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Preferred Content Types</h4>
              <div className="space-y-2">
                {(analyticsData.predictiveAnalytics.audienceInsights.preferredContentTypes || []).map((type, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard;
