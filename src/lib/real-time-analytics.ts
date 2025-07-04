/**
 * Real-time Analytics Service
 * Provides real-time metrics, live updates, and streaming analytics
 */

import { EventEmitter } from 'events';

export interface RealTimeMetric {
  id: string;
  postId: string;
  platform: string;
  metricType: 'view' | 'like' | 'comment' | 'share' | 'click';
  value: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface LiveAnalytics {
  postId: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  realtimeViews: number; // Views in last 5 minutes
  engagementRate: number;
  platformBreakdown: Record<string, {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
  lastUpdated: Date;
  isLive: boolean;
}

export interface AnalyticsAlert {
  id: string;
  type: 'viral_potential' | 'engagement_spike' | 'performance_drop' | 'milestone_reached';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  postId: string;
  platform?: string;
  threshold?: number;
  currentValue?: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface TrendingContent {
  postId: string;
  title: string;
  platform: string;
  trendScore: number;
  velocityScore: number; // Rate of engagement increase
  currentViews: number;
  projectedViews: number;
  timeToTrend: number; // Minutes
  confidence: number;
}

class RealTimeAnalyticsService extends EventEmitter {
  private metrics: Map<string, RealTimeMetric[]> = new Map(); // postId -> metrics
  private liveAnalytics: Map<string, LiveAnalytics> = new Map(); // postId -> analytics
  private alerts: Map<string, AnalyticsAlert[]> = new Map(); // userId -> alerts
  private subscribers: Map<string, Set<string>> = new Map(); // userId -> postIds
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    super();
    this.startPeriodicUpdates();
  }

  /**
   * Subscribe to real-time updates for specific posts
   */
  subscribe(userId: string, postIds: string[]): void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    const userSubscriptions = this.subscribers.get(userId)!;
    postIds.forEach(postId => {
      userSubscriptions.add(postId);
      this.initializeLiveAnalytics(postId);
    });

    this.emit('subscribed', { userId, postIds });
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(userId: string, postIds?: string[]): void {
    const userSubscriptions = this.subscribers.get(userId);
    if (!userSubscriptions) return;

    if (postIds) {
      postIds.forEach(postId => userSubscriptions.delete(postId));
    } else {
      userSubscriptions.clear();
    }

    if (userSubscriptions.size === 0) {
      this.subscribers.delete(userId);
    }

    this.emit('unsubscribed', { userId, postIds });
  }

  /**
   * Record a real-time metric
   */
  recordMetric(metric: Omit<RealTimeMetric, 'id' | 'timestamp'>): void {
    const fullMetric: RealTimeMetric = {
      ...metric,
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // Store the metric
    if (!this.metrics.has(metric.postId)) {
      this.metrics.set(metric.postId, []);
    }
    
    const postMetrics = this.metrics.get(metric.postId)!;
    postMetrics.push(fullMetric);

    // Keep only last 1000 metrics per post
    if (postMetrics.length > 1000) {
      postMetrics.splice(0, postMetrics.length - 1000);
    }

    // Update live analytics
    this.updateLiveAnalytics(metric.postId);

    // Check for alerts
    this.checkForAlerts(metric.postId, fullMetric);

    // Emit real-time update
    this.emit('metric', fullMetric);
    this.emit(`metric:${metric.postId}`, fullMetric);
  }

  /**
   * Get live analytics for a post
   */
  getLiveAnalytics(postId: string): LiveAnalytics | null {
    return this.liveAnalytics.get(postId) || null;
  }

  /**
   * Get recent metrics for a post
   */
  getRecentMetrics(postId: string, minutes: number = 60): RealTimeMetric[] {
    const postMetrics = this.metrics.get(postId) || [];
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    return postMetrics.filter(metric => metric.timestamp >= cutoffTime);
  }

  /**
   * Get analytics alerts for a user
   */
  getAlerts(userId: string, unacknowledgedOnly: boolean = false): AnalyticsAlert[] {
    const userAlerts = this.alerts.get(userId) || [];
    
    if (unacknowledgedOnly) {
      return userAlerts.filter(alert => !alert.acknowledged);
    }
    
    return userAlerts;
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(userId: string, alertId: string): boolean {
    const userAlerts = this.alerts.get(userId);
    if (!userAlerts) return false;

    const alert = userAlerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    this.emit('alert:acknowledged', { userId, alertId });
    
    return true;
  }

  /**
   * Get trending content analysis
   */
  getTrendingContent(limit: number = 10): TrendingContent[] {
    const trending: TrendingContent[] = [];

    for (const [postId, analytics] of this.liveAnalytics.entries()) {
      if (!analytics.isLive) continue;

      const recentMetrics = this.getRecentMetrics(postId, 30); // Last 30 minutes
      const velocityScore = this.calculateVelocityScore(recentMetrics);
      const trendScore = this.calculateTrendScore(analytics, velocityScore);

      if (trendScore > 50) { // Only include posts with significant trend potential
        trending.push({
          postId,
          title: `Post ${postId}`, // In real implementation, fetch from database
          platform: 'multiple',
          trendScore,
          velocityScore,
          currentViews: analytics.totalViews,
          projectedViews: this.projectViews(analytics, velocityScore),
          timeToTrend: this.estimateTimeToTrend(velocityScore),
          confidence: Math.min(trendScore / 100, 0.95)
        });
      }
    }

    return trending
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  /**
   * Get real-time engagement metrics
   */
  getRealTimeEngagement(postId: string, timeWindow: number = 5): {
    viewsPerMinute: number;
    likesPerMinute: number;
    commentsPerMinute: number;
    engagementVelocity: number;
  } {
    const recentMetrics = this.getRecentMetrics(postId, timeWindow);
    
    const views = recentMetrics.filter(m => m.metricType === 'view').length;
    const likes = recentMetrics.filter(m => m.metricType === 'like').length;
    const comments = recentMetrics.filter(m => m.metricType === 'comment').length;

    return {
      viewsPerMinute: views / timeWindow,
      likesPerMinute: likes / timeWindow,
      commentsPerMinute: comments / timeWindow,
      engagementVelocity: (likes + comments) / Math.max(views, 1) * 100
    };
  }

  private initializeLiveAnalytics(postId: string): void {
    if (this.liveAnalytics.has(postId)) return;

    this.liveAnalytics.set(postId, {
      postId,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      realtimeViews: 0,
      engagementRate: 0,
      platformBreakdown: {},
      lastUpdated: new Date(),
      isLive: true
    });
  }

  private updateLiveAnalytics(postId: string): void {
    const analytics = this.liveAnalytics.get(postId);
    if (!analytics) return;

    const allMetrics = this.metrics.get(postId) || [];
    const recentMetrics = this.getRecentMetrics(postId, 5); // Last 5 minutes

    // Calculate totals
    analytics.totalViews = allMetrics.filter(m => m.metricType === 'view').length;
    analytics.totalLikes = allMetrics.filter(m => m.metricType === 'like').length;
    analytics.totalComments = allMetrics.filter(m => m.metricType === 'comment').length;
    analytics.totalShares = allMetrics.filter(m => m.metricType === 'share').length;
    analytics.realtimeViews = recentMetrics.filter(m => m.metricType === 'view').length;

    // Calculate engagement rate
    const totalEngagements = analytics.totalLikes + analytics.totalComments + analytics.totalShares;
    analytics.engagementRate = analytics.totalViews > 0 
      ? (totalEngagements / analytics.totalViews) * 100 
      : 0;

    // Update platform breakdown
    analytics.platformBreakdown = {};
    allMetrics.forEach(metric => {
      if (!analytics.platformBreakdown[metric.platform]) {
        analytics.platformBreakdown[metric.platform] = {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0
        };
      }
      analytics.platformBreakdown[metric.platform][metric.metricType + 's' as keyof typeof analytics.platformBreakdown[string]]++;
    });

    analytics.lastUpdated = new Date();

    // Emit update
    this.emit('analytics:updated', analytics);
    this.emit(`analytics:${postId}`, analytics);
  }

  private checkForAlerts(postId: string, metric: RealTimeMetric): void {
    const analytics = this.liveAnalytics.get(postId);
    if (!analytics) return;

    const alerts: AnalyticsAlert[] = [];

    // Viral potential alert
    if (analytics.realtimeViews > 100 && analytics.engagementRate > 10) {
      alerts.push({
        id: `alert-${Date.now()}-viral`,
        type: 'viral_potential',
        severity: 'info',
        title: 'Viral Potential Detected',
        message: `Post ${postId} is showing viral potential with ${analytics.realtimeViews} views in 5 minutes`,
        postId,
        platform: metric.platform,
        currentValue: analytics.realtimeViews,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Engagement spike alert
    const recentEngagement = this.getRealTimeEngagement(postId, 5);
    if (recentEngagement.engagementVelocity > 20) {
      alerts.push({
        id: `alert-${Date.now()}-spike`,
        type: 'engagement_spike',
        severity: 'warning',
        title: 'Engagement Spike',
        message: `High engagement velocity detected: ${recentEngagement.engagementVelocity.toFixed(1)}%`,
        postId,
        platform: metric.platform,
        currentValue: recentEngagement.engagementVelocity,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Store alerts for all subscribers
    alerts.forEach(alert => {
      for (const [userId, subscribedPosts] of this.subscribers.entries()) {
        if (subscribedPosts.has(postId)) {
          if (!this.alerts.has(userId)) {
            this.alerts.set(userId, []);
          }
          this.alerts.get(userId)!.push(alert);
          this.emit('alert', { userId, alert });
        }
      }
    });
  }

  private calculateVelocityScore(metrics: RealTimeMetric[]): number {
    if (metrics.length === 0) return 0;

    const timeSpan = 30; // 30 minutes
    const engagementMetrics = metrics.filter(m => 
      m.metricType === 'like' || m.metricType === 'comment' || m.metricType === 'share'
    );

    return (engagementMetrics.length / timeSpan) * 60; // Engagements per hour
  }

  private calculateTrendScore(analytics: LiveAnalytics, velocityScore: number): number {
    const baseScore = Math.min(analytics.engagementRate * 2, 50);
    const velocityBonus = Math.min(velocityScore, 30);
    const realtimeBonus = Math.min(analytics.realtimeViews / 10, 20);

    return baseScore + velocityBonus + realtimeBonus;
  }

  private projectViews(analytics: LiveAnalytics, velocityScore: number): number {
    const currentGrowthRate = analytics.realtimeViews / 5; // Views per minute
    const projectedGrowth = currentGrowthRate * velocityScore * 60; // Next hour projection
    return analytics.totalViews + Math.round(projectedGrowth);
  }

  private estimateTimeToTrend(velocityScore: number): number {
    // Estimate minutes to reach trending status based on velocity
    const trendingThreshold = 1000; // Views needed to trend
    const currentRate = velocityScore / 60; // Views per minute
    
    if (currentRate <= 0) return Infinity;
    return Math.round(trendingThreshold / currentRate);
  }

  private startPeriodicUpdates(): void {
    // Update analytics every 30 seconds
    setInterval(() => {
      for (const postId of this.liveAnalytics.keys()) {
        this.updateLiveAnalytics(postId);
      }
    }, 30000);

    // Clean up old metrics every 5 minutes
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 300000);
  }

  private cleanupOldMetrics(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    for (const [postId, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(metric => metric.timestamp >= cutoffTime);
      this.metrics.set(postId, filteredMetrics);

      // Remove analytics for posts with no recent activity
      if (filteredMetrics.length === 0) {
        this.liveAnalytics.delete(postId);
      }
    }
  }
}

// Export singleton instance
export const realTimeAnalytics = new RealTimeAnalyticsService();

// Export utility functions
export const subscribeToRealTimeAnalytics = (userId: string, postIds: string[]) =>
  realTimeAnalytics.subscribe(userId, postIds);

export const recordRealTimeMetric = (metric: Omit<RealTimeMetric, 'id' | 'timestamp'>) =>
  realTimeAnalytics.recordMetric(metric);

export const getLiveAnalytics = (postId: string) =>
  realTimeAnalytics.getLiveAnalytics(postId);
