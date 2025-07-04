/**
 * Advanced Analytics Dashboard Types
 * Comprehensive analytics interfaces for content performance tracking
 */

// Analytics Data Types
export interface AnalyticsOverview {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
  averageReadTime: number;
  conversionRate: number;
  revenueGenerated: number;
  subscriberGrowth: number;
}

export interface ContentMetrics {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: number;
  bounceRate: number;
  engagementScore: number;
  platformPerformance: PlatformMetrics[];
  trending: boolean;
  revenue?: number;
}

export interface PlatformMetrics {
  platform: string;
  platformId: string;
  reach: number;
  impressions: number;
  clicks: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
  ctr: number; // Click-through rate
  cpm: number; // Cost per mille
  roi: number; // Return on investment
  lastUpdated: string;
}

export interface AudienceInsights {
  demographics: {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
    languages: Record<string, number>;
  };
  interests: Array<{
    category: string;
    percentage: number;
    engagement: number;
  }>;
  behavior: {
    averageSessionDuration: number;
    pagesPerSession: number;
    returningVisitorRate: number;
    newVisitorRate: number;
    peakActivity: Array<{
      hour: number;
      day: string;
      activity: number;
    }>;
  };
}

export interface TrendingContent {
  id: string;
  title: string;
  platform: string;
  trendScore: number;
  growthRate: number;
  timeframe: string;
  category: string;
  tags: string[];
  metrics: {
    views: number;
    engagement: number;
    velocity: number; // Rate of growth
  };
}

export interface CompetitorAnalysis {
  competitor: string;
  domain: string;
  estimatedTraffic: number;
  marketShare: number;
  contentStrategy: {
    postingFrequency: number;
    averageLength: number;
    topCategories: string[];
    engagementRate: number;
  };
  strengths: string[];
  opportunities: string[];
  threats: string[];
}

export interface SEOInsights {
  keywords: Array<{
    keyword: string;
    position: number;
    searchVolume: number;
    difficulty: number;
    traffic: number;
    trends: number[];
  }>;
  backlinks: {
    total: number;
    domains: number;
    newThisMonth: number;
    quality: 'high' | 'medium' | 'low';
  };
  technicalSEO: {
    score: number;
    issues: Array<{
      type: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      description: string;
      pages: number;
    }>;
  };
  contentGaps: Array<{
    keyword: string;
    opportunity: number;
    difficulty: number;
    suggestedContent: string;
  }>;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRecurring: number;
  subscriptions: {
    total: number;
    new: number;
    churned: number;
    churnRate: number;
  };
  sources: Array<{
    source: string;
    revenue: number;
    percentage: number;
    growth: number;
  }>;
  conversions: {
    rate: number;
    total: number;
    bySource: Record<string, number>;
    byContent: Array<{
      contentId: string;
      title: string;
      conversions: number;
      revenue: number;
    }>;
  };
}

export interface SocialMediaAnalytics {
  platforms: Array<{
    platform: string;
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
    growth: {
      followers: number;
      engagement: number;
      reach: number;
    };
    topPosts: Array<{
      id: string;
      content: string;
      engagement: number;
      reach: number;
      link?: string;
    }>;
  }>;
  crossPlatformMetrics: {
    totalReach: number;
    averageEngagement: number;
    bestPerformingPlatform: string;
    contentConsistency: number;
  };
}

export interface EmailAnalytics {
  subscribers: {
    total: number;
    active: number;
    growth: number;
    churnRate: number;
  };
  campaigns: Array<{
    id: string;
    subject: string;
    sentDate: string;
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
    revenue: number;
  }>;
  automation: {
    sequences: number;
    active: number;
    performance: Record<string, number>;
  };
}

// Analytics Query Types
export interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  platforms?: string[];
  contentTypes?: string[];
  categories?: string[];
  authors?: string[];
  tags?: string[];
  metrics?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'platform' | 'category';
  limit?: number;
  offset?: number;
}

export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains';
  value: any;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

// Real-time Analytics Types
export interface RealTimeMetrics {
  activeUsers: number;
  currentViews: number;
  liveEvents: Array<{
    type: 'view' | 'like' | 'comment' | 'share' | 'subscribe';
    contentId: string;
    timestamp: string;
    platform: string;
    userId?: string;
  }>;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    timeframe: string;
  }>;
}

// Reporting Types
export interface AnalyticsReport {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'custom' | 'automated';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'pdf' | 'csv' | 'json' | 'dashboard';
  recipients: string[];
  data: any;
  createdAt: string;
  lastGenerated?: string;
  nextGeneration?: string;
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  widgets: AnalyticsWidget[];
  layout: DashboardLayout;
  permissions: string[];
  shared: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'funnel' | 'heatmap';
  title: string;
  query: AnalyticsQuery;
  visualization: {
    chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'gauge';
    options: Record<string, any>;
  };
  size: 'small' | 'medium' | 'large' | 'full';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gaps: {
    x: number;
    y: number;
  };
  responsive: boolean;
}

// Analytics Service Interface
export interface AnalyticsService {
  getOverview(query: AnalyticsQuery): Promise<AnalyticsOverview>;
  getContentMetrics(query: AnalyticsQuery): Promise<ContentMetrics[]>;
  getAudienceInsights(query: AnalyticsQuery): Promise<AudienceInsights>;
  getTrendingContent(timeframe: string): Promise<TrendingContent[]>;
  getCompetitorAnalysis(competitors: string[]): Promise<CompetitorAnalysis[]>;
  getSEOInsights(query: AnalyticsQuery): Promise<SEOInsights>;
  getRevenueAnalytics(query: AnalyticsQuery): Promise<RevenueAnalytics>;
  getSocialMediaAnalytics(query: AnalyticsQuery): Promise<SocialMediaAnalytics>;
  getEmailAnalytics(query: AnalyticsQuery): Promise<EmailAnalytics>;
  getRealTimeMetrics(): Promise<RealTimeMetrics>;
  generateReport(reportConfig: Partial<AnalyticsReport>): Promise<AnalyticsReport>;
  exportData(query: AnalyticsQuery, format: string): Promise<Buffer>;
}

// Goals and KPIs
export interface AnalyticsGoal {
  id: string;
  name: string;
  description: string;
  metric: string;
  target: number;
  current: number;
  progress: number;
  timeframe: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
  createdAt: string;
  deadline: string;
}

export interface KPITracking {
  kpi: string;
  current: number;
  target: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

// Alerts and Notifications
export interface AnalyticsAlert {
  id: string;
  name: string;
  condition: {
    metric: string;
    operator: string;
    threshold: number;
    timeframe: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: ('email' | 'slack' | 'webhook' | 'sms')[];
  recipients: string[];
  active: boolean;
  lastTriggered?: string;
  triggeredCount: number;
}

export interface AnalyticsNotification {
  id: string;
  type: 'alert' | 'report' | 'insight' | 'anomaly';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  data?: any;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}
