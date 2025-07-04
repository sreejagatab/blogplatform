import { Metadata } from 'next'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHero } from '@/components/sections/page-hero'
import { ContentSection } from '@/components/sections/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Share2,
  MessageCircle,
  Heart,
  Target,
  Calendar,
  Filter,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Team Analytics & Reporting | Help Center',
  description: 'Learn how to use team analytics and reporting features to track performance, measure engagement, and optimize your content strategy.',
}

export default function TeamAnalyticsHelpPage() {
  return (
    <PageLayout>
      <PageHero
        title="Team Analytics & Reporting"
        description="Track performance, measure engagement, and optimize your content strategy with powerful team analytics"
        size="lg"
      />

      <ContentSection>
        <div className="max-w-4xl mx-auto">
          {/* Quick Navigation */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Dashboard Overview</h3>
                      <p className="text-sm text-muted-foreground">Main analytics dashboard</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Team Performance</h3>
                      <p className="text-sm text-muted-foreground">Individual & team metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Download className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Export Reports</h3>
                      <p className="text-sm text-muted-foreground">Download and share data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Dashboard Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard Overview</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Accessing Team Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Navigate to the team analytics dashboard to view comprehensive performance metrics:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Go to <strong>Admin Panel</strong> → <strong>Analytics</strong></li>
                    <li>Select <strong>Team Performance</strong> tab</li>
                    <li>Choose your date range and filters</li>
                    <li>View real-time and historical data</li>
                  </ol>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900">Pro Tip</h4>
                        <p className="text-blue-800">Use the date picker to compare performance across different time periods and identify trends.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Metrics Explained
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Total Views</h4>
                          <p className="text-sm text-muted-foreground">Number of times your content was viewed across all platforms</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-red-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Engagement Rate</h4>
                          <p className="text-sm text-muted-foreground">Likes, comments, and shares relative to total views</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Share2 className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Share Rate</h4>
                          <p className="text-sm text-muted-foreground">How often your content gets shared by others</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Comments</h4>
                          <p className="text-sm text-muted-foreground">Total comments and replies on your posts</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-orange-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Reach</h4>
                          <p className="text-sm text-muted-foreground">Unique users who saw your content</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-indigo-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Publishing Frequency</h4>
                          <p className="text-sm text-muted-foreground">How often team members publish content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Performance Tracking */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Team Performance Tracking</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Individual Team Member Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Track individual performance to identify top performers and areas for improvement:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span><strong>Content Output:</strong> Number of posts published per team member</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span><strong>Engagement Performance:</strong> Average engagement rates by author</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span><strong>Platform Performance:</strong> Which platforms work best for each team member</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span><strong>Content Categories:</strong> Performance by content type and topic</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtering and Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Use advanced filters to drill down into specific data:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Time-based Filters</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Last 7 days, 30 days, 90 days</li>
                        <li>• Custom date ranges</li>
                        <li>• Compare periods</li>
                        <li>• Weekly/monthly views</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Content Filters</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• By platform (LinkedIn, Twitter, etc.)</li>
                        <li>• By content type (blog, social, video)</li>
                        <li>• By author or team member</li>
                        <li>• By tags and categories</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reporting and Exports */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Reporting and Exports</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Exporting Analytics Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Generate and export detailed reports for stakeholders:</p>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Available Export Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">PDF Reports</Badge>
                      <Badge variant="secondary">Excel Spreadsheets</Badge>
                      <Badge variant="secondary">CSV Data</Badge>
                      <Badge variant="secondary">PowerPoint Slides</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Report Types</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Executive Summary:</strong> High-level overview for leadership</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Detailed Analytics:</strong> Comprehensive data for analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Team Performance:</strong> Individual and team metrics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Platform Comparison:</strong> Cross-platform performance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900">Automated Reports</h4>
                        <p className="text-green-800">Set up weekly or monthly automated reports to be sent to your team and stakeholders.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Regular Review Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Review analytics weekly with your team</li>
                    <li>• Set monthly performance goals</li>
                    <li>• Quarterly strategy adjustments</li>
                    <li>• Annual comprehensive reviews</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data-Driven Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Use data to guide content strategy</li>
                    <li>• Identify top-performing content types</li>
                    <li>• Optimize posting times and frequency</li>
                    <li>• Adjust platform focus based on results</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Help Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Help Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Setting Up Team Permissions</h3>
                  <p className="text-sm text-muted-foreground mb-3">Learn how to configure team roles and access levels</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/help/team-collaboration/permissions">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Content Approval Workflows</h3>
                  <p className="text-sm text-muted-foreground mb-3">Set up approval processes for team content</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/help/team-collaboration/workflows">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Need Additional Help?</h3>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you make the most of your analytics data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/help">
                    Browse All Help Articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </PageLayout>
  )
}
