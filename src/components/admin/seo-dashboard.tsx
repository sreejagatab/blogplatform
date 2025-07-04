'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Eye,
  Zap,
  Globe,
  Hash,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Lightbulb,
  Users,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { seoService, SEOAnalysis, SEOIssue, SEOSuggestion } from '@/lib/seo-service'
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

export default function SEODashboard() {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [contentToAnalyze, setContentToAnalyze] = useState('')
  const [selectedTab, setSelectedTab] = useState<'overview' | 'keywords' | 'technical' | 'competitors'>('overview')

  const analyzeContent = async () => {
    if (!contentToAnalyze.trim()) return

    setLoading(true)
    try {
      const result = await seoService.analyzeContent(contentToAnalyze, 'https://example.com', {
        title: 'Sample Title',
        description: 'Sample meta description for SEO analysis',
        keywords: ['web development', 'SEO', 'optimization']
      })
      setAnalysis(result)
    } catch (error) {
      console.error('SEO analysis failed:', error)
    } finally {
      setLoading(false)
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

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle
      case 'warning': return AlertTriangle
      case 'info': return Lightbulb
      default: return AlertTriangle
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const mockKeywordData = [
    { keyword: 'web development', position: 3, volume: 8100, difficulty: 65, trend: 'up' },
    { keyword: 'javascript tutorial', position: 7, volume: 5400, difficulty: 45, trend: 'up' },
    { keyword: 'react hooks', position: 12, volume: 3200, difficulty: 55, trend: 'down' },
    { keyword: 'frontend development', position: 5, volume: 4800, difficulty: 60, trend: 'stable' },
    { keyword: 'web performance', position: 15, volume: 2100, difficulty: 70, trend: 'up' }
  ]

  const mockCompetitorData = [
    { name: 'Competitor A', score: 85, keywords: 245, backlinks: 12500 },
    { name: 'Competitor B', score: 78, keywords: 189, backlinks: 8900 },
    { name: 'Competitor C', score: 72, keywords: 156, backlinks: 6700 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SEO Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze and optimize your content for search engines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Content Analysis Input */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Analyze Content
        </h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your content here for SEO analysis..."
            value={contentToAnalyze}
            onChange={(e) => setContentToAnalyze(e.target.value)}
            className="min-h-[120px]"
          />
          <Button
            onClick={analyzeContent}
            disabled={loading || !contentToAnalyze.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze SEO
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'keywords', label: 'Keywords', icon: Hash },
          { id: 'technical', label: 'Technical', icon: Settings },
          { id: 'competitors', label: 'Competitors', icon: Users }
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

      {/* Overview Tab */}
      {selectedTab === 'overview' && analysis && (
        <div className="space-y-6">
          {/* SEO Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className={`p-6 ${getScoreBg(analysis.score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall SEO Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}%
                  </p>
                </div>
                <Target className={`h-8 w-8 ${getScoreColor(analysis.score)}`} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">
                    {analysis.issues.filter(i => i.type === 'critical').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {analysis.issues.filter(i => i.type === 'warning').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suggestions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analysis.suggestions.length}
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SEO Score Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Content Quality</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Technical SEO</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Keywords</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 35) + 50}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 25) + 75}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.content.wordCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Words</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.content.readabilityScore}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Readability</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.technical.headings.h2.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">H2 Tags</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysis.technical.images.total}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Images</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Issues and Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                SEO Issues
              </h3>
              <div className="space-y-3">
                {analysis.issues.slice(0, 5).map((issue, index) => {
                  const Icon = getIssueIcon(issue.type)
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <Icon className={`h-5 w-5 mt-0.5 ${getIssueColor(issue.type)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {issue.title}
                          </h4>
                          <Badge
                            className={
                              issue.impact === 'high' ? 'bg-red-100 text-red-800' :
                              issue.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }
                          >
                            {issue.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {issue.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Fix: {issue.fix}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Suggestions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Optimization Suggestions
              </h3>
              <div className="space-y-3">
                {analysis.suggestions.slice(0, 5).map((suggestion, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <Badge
                        className={
                          suggestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          suggestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {suggestion.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {suggestion.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Expected impact: {suggestion.expectedImpact}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {selectedTab === 'keywords' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Keyword Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Keyword</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Position</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Difficulty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {mockKeywordData.map((keyword, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {keyword.keyword}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                          keyword.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          #{keyword.position}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {keyword.volume.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                keyword.difficulty <= 30 ? 'bg-green-500' :
                                keyword.difficulty <= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${keyword.difficulty}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {keyword.difficulty}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {keyword.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {keyword.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        {keyword.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full"></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Technical Tab */}
      {selectedTab === 'technical' && analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meta Tags */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Meta Tags
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Title Tag</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.metaTags.title.present ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.technical.metaTags.title.length} chars
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta Description</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.metaTags.description.present ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.technical.metaTags.description.length} chars
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Graph</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.metaTags.openGraph.complete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Content Structure */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Structure
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">H1 Tags</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.headings.h1.optimized ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.technical.headings.h1.count}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">H2 Tags</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.headings.h2.distribution ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.technical.headings.h2.count}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Images with Alt</span>
                  <div className="flex items-center gap-2">
                    {analysis.technical.images.withAlt === analysis.technical.images.total ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.technical.images.withAlt}/{analysis.technical.images.total}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Competitors Tab */}
      {selectedTab === 'competitors' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Competitor Analysis
            </h3>
            <div className="space-y-4">
              {mockCompetitorData.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {competitor.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>{competitor.keywords} keywords</span>
                      <span>{competitor.backlinks.toLocaleString()} backlinks</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(competitor.score)}`}>
                      {competitor.score}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      SEO Score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* No Analysis State */}
      {!analysis && !loading && (
        <Card className="p-12 text-center">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Enter content above to get started with SEO analysis
          </p>
        </Card>
      )}
    </div>
  )
}