'use client'

import { useState, useEffect } from 'react'
import { 
  Brain,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Eye,
  Users,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { aiService, AIInsights, TrendAnalysis, PredictiveAnalytics } from '@/lib/ai-service'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function AIInsightsDashboard() {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [trends, setTrends] = useState<TrendAnalysis[]>([])
  const [predictions, setPredictions] = useState<PredictiveAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'insights' | 'trends' | 'predictions'>('insights')

  useEffect(() => {
    loadAIData()
  }, [])

  const loadAIData = async () => {
    setLoading(true)
    try {
      const [insightsData, trendsData, predictionsData] = await Promise.all([
        aiService.getAIInsights({
          recentPosts: [],
          analytics: {},
          competitors: ['competitor1', 'competitor2']
        }),
        aiService.analyzeTrends(['AI', 'Web Development', 'React', 'TypeScript']),
        aiService.generatePredictiveAnalytics([])
      ])

      setInsights(insightsData)
      setTrends(trendsData)
      setPredictions(predictionsData)
    } catch (error) {
      console.error('Failed to load AI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (momentum: string) => {
    switch (momentum) {
      case 'rising': return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'declining': return <ArrowDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading AI insights...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered content recommendations and performance predictions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAIData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Export functionality
              const data = JSON.stringify(insights, null, 2)
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'ai-insights.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Settings functionality - could open a modal or navigate to settings
              console.log('Opening AI insights settings...')
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'insights', label: 'Content Insights', icon: Lightbulb },
          { id: 'trends', label: 'Trend Analysis', icon: TrendingUp },
          { id: 'predictions', label: 'Predictions', icon: Target }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setSelectedTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Content Insights Tab */}
      {selectedTab === 'insights' && insights && (
        <div className="space-y-6">
          {/* Content Suggestions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              AI Content Suggestions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.contentSuggestions.map((suggestion, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h4>
                    <Badge className={
                      suggestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      suggestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {suggestion.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {suggestion.reasoning}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`text-sm font-medium ${getTrendColor(suggestion.trendScore)}`}>
                        {suggestion.trendScore}% trending
                      </span>
                    </div>
                    <Button size="sm">
                      Generate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Optimization Tips */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Optimization Recommendations
            </h3>
            
            <div className="space-y-4">
              {insights.optimizationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      tip.impact === 'high' ? 'bg-red-500' :
                      tip.impact === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {tip.suggestion}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {tip.area}
                      </Badge>
                      <span className={`text-xs font-medium ${getImpactColor(tip.impact)}`}>
                        {tip.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tip.implementation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Competitor Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Competitor Analysis
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.competitorAnalysis.map((competitor, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {competitor.competitor}
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-green-600 mb-2">Strengths</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-yellow-600 mb-2">Opportunities</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {competitor.opportunities.map((opportunity, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-blue-600 mb-2">Content Gaps</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {competitor.contentGaps.map((gap, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {selectedTab === 'trends' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Topic Trend Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trends.map((trend, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {trend.topic}
                    </h4>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(trend.momentum)}
                      <span className={`font-bold ${getTrendColor(trend.trendScore)}`}>
                        {trend.trendScore}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Search Volume:</span>
                      <span className="font-medium">{trend.searchVolume.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Competition:</span>
                      <Badge className={
                        trend.competitionLevel === 'low' ? 'bg-green-100 text-green-800' :
                        trend.competitionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {trend.competitionLevel}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Best Times:</span>
                      <div className="flex flex-wrap gap-1">
                        {trend.bestPublishingTimes.map((time, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-2">Platforms:</span>
                      <div className="flex flex-wrap gap-1">
                        {trend.suggestedPlatforms.map((platform, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Predictions Tab */}
      {selectedTab === 'predictions' && predictions && (
        <div className="space-y-6">
          {/* Performance Prediction */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Content Performance Prediction
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {predictions.contentPerformancePrediction.expectedViews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Expected Views</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {predictions.contentPerformancePrediction.expectedEngagement.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Expected Engagement</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {predictions.contentPerformancePrediction.viralPotential}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Viral Potential</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Best Platforms</div>
                <div className="space-y-1">
                  {predictions.contentPerformancePrediction.bestPerformingPlatforms.map((platform, i) => (
                    <Badge key={i} variant="secondary" className="text-xs block">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Audience Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Audience Insights
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Engagement Patterns
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={Object.entries(predictions.audienceInsights.engagementPatterns).map(([day, value]) => ({ day, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Optimal Posting Times
                </h4>
                <div className="space-y-2">
                  {predictions.audienceInsights.optimalPostingTimes.map((time, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{time}</span>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 mt-6">
                  Preferred Content Types
                </h4>
                <div className="space-y-2">
                  {predictions.audienceInsights.preferredContentTypes.map((type, i) => (
                    <Badge key={i} variant="outline" className="mr-2 mb-2">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Content Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Content Recommendations
            </h3>
            
            <div className="space-y-4">
              {predictions.contentRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rec.topic}
                      </h4>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {rec.estimatedImpact}% impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.reason}
                    </p>
                  </div>
                  <Button size="sm">
                    Create Content
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
