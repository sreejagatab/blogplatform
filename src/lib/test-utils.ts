/**
 * Testing Utilities for Universal Blog Platform
 * Provides comprehensive testing helpers and mock data
 */

import { BlogPost, PlatformCredentials, AdaptedContent, PostResult } from './platforms/types'
import { AnalyticsEvent, AnalyticsMetrics } from './analytics-service'
import { EmailTemplate, EmailCampaign, EmailRecipient } from './email-service'
import { SEOAnalysis } from './seo-service'

// Mock Data Generators
export const createMockBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  id: 'test-post-1',
  title: 'Test Blog Post',
  content: 'This is a test blog post content with some **markdown** formatting.',
  excerpt: 'This is a test excerpt',
  slug: 'test-blog-post',
  status: 'published',
  author: {
    id: 'author-1',
    name: 'Test Author',
    email: 'author@test.com'
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  publishedAt: new Date('2024-01-15'),
  tags: ['testing', 'blog', 'platform'],
  categories: ['Technology'],
  featuredImage: 'https://example.com/image.jpg',
  canonicalUrl: 'https://example.com/test-blog-post',
  seoTitle: 'Test Blog Post - SEO Title',
  seoDescription: 'This is a test SEO description for the blog post',
  ...overrides
})

export const createMockPlatformCredentials = (platform: string): PlatformCredentials => ({
  platform,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  userId: 'mock-user-id',
  username: 'mock-username'
})

export const createMockAdaptedContent = (overrides?: Partial<AdaptedContent>): AdaptedContent => ({
  title: 'Adapted Test Post',
  content: 'This is adapted content for the platform.',
  hashtags: ['#testing', '#blog'],
  images: ['https://example.com/image.jpg'],
  metadata: {
    originalLength: 500,
    adaptedLength: 200,
    warnings: []
  },
  ...overrides
})

export const createMockPostResult = (success: boolean = true): PostResult => ({
  success,
  platformPostId: success ? 'mock-post-id-123' : undefined,
  platformUrl: success ? 'https://platform.com/posts/123' : undefined,
  errorMessage: success ? undefined : 'Mock error message'
})

export const createMockAnalyticsEvent = (overrides?: Partial<AnalyticsEvent>): AnalyticsEvent => ({
  id: 'event-123',
  type: 'view',
  postId: 'post-123',
  platform: 'linkedin',
  userId: 'user-123',
  sessionId: 'session-123',
  timestamp: new Date(),
  metadata: {},
  location: {
    country: 'US',
    city: 'New York',
    region: 'NY'
  },
  device: {
    type: 'desktop',
    os: 'Windows',
    browser: 'Chrome'
  },
  ...overrides
})

export const createMockAnalyticsMetrics = (): AnalyticsMetrics => ({
  totalViews: 12500,
  totalLikes: 450,
  totalComments: 89,
  totalShares: 156,
  uniqueVisitors: 8900,
  bounceRate: 35.2,
  avgSessionDuration: 245,
  topPosts: [
    {
      id: 'post-1',
      title: 'Top Performing Post',
      views: 5000,
      engagement: 250
    }
  ],
  platformBreakdown: [
    {
      platform: 'LinkedIn',
      views: 5000,
      percentage: 40
    },
    {
      platform: 'Twitter',
      views: 3750,
      percentage: 30
    }
  ],
  timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
    views: Math.floor(Math.random() * 1000) + 500,
    likes: Math.floor(Math.random() * 100) + 20,
    comments: Math.floor(Math.random() * 20) + 5,
    shares: Math.floor(Math.random() * 50) + 10
  })),
  realTimeActivity: []
})

export const createMockEmailTemplate = (overrides?: Partial<EmailTemplate>): EmailTemplate => ({
  id: 'template-123',
  name: 'Test Email Template',
  subject: 'Test Subject',
  htmlContent: '<h1>Test Email</h1><p>This is a test email template.</p>',
  textContent: 'Test Email\n\nThis is a test email template.',
  variables: ['name', 'email'],
  category: 'newsletter',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
})

export const createMockEmailCampaign = (overrides?: Partial<EmailCampaign>): EmailCampaign => ({
  id: 'campaign-123',
  name: 'Test Campaign',
  templateId: 'template-123',
  subject: 'Test Campaign Subject',
  recipients: [createMockEmailRecipient()],
  status: 'draft',
  stats: {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0
  },
  settings: {
    trackOpens: true,
    trackClicks: true,
    allowUnsubscribe: true
  },
  ...overrides
})

export const createMockEmailRecipient = (overrides?: Partial<EmailRecipient>): EmailRecipient => ({
  email: 'test@example.com',
  name: 'Test User',
  tags: ['test', 'user'],
  subscribed: true,
  subscribedAt: new Date('2024-01-01'),
  engagement: {
    opens: 5,
    clicks: 2,
    lastOpened: new Date('2024-01-10'),
    lastClicked: new Date('2024-01-08')
  },
  ...overrides
})

export const createMockSEOAnalysis = (): SEOAnalysis => ({
  score: 85,
  issues: [
    {
      type: 'warning',
      category: 'content',
      title: 'Low word count',
      description: 'Content is shorter than recommended',
      impact: 'medium',
      fix: 'Add more detailed content',
      priority: 1
    }
  ],
  suggestions: [
    {
      type: 'optimization',
      title: 'Add meta description',
      description: 'Improve search engine visibility',
      implementation: 'Add a compelling meta description',
      expectedImpact: 'Better click-through rates',
      difficulty: 'easy'
    }
  ],
  keywords: {
    primary: ['web development', 'testing'],
    secondary: ['javascript', 'react'],
    longtail: ['how to test web applications'],
    density: { 'web development': 2.5, 'testing': 1.8 },
    distribution: { 'web development': 80, 'testing': 60 },
    opportunities: ['automation', 'best practices'],
    competition: { 'web development': 'high', 'testing': 'medium' },
    searchVolume: { 'web development': 8100, 'testing': 5400 },
    trends: { 'web development': [100, 95, 110, 105], 'testing': [80, 85, 90, 88] }
  },
  technical: {
    metaTags: {
      title: { present: true, length: 45, optimized: true },
      description: { present: true, length: 140, optimized: true },
      keywords: { present: true, count: 5 },
      robots: { present: true, value: 'index,follow' },
      canonical: { present: true, url: 'https://example.com/test' },
      openGraph: { present: true, complete: true },
      twitterCard: { present: true, complete: true }
    },
    headings: {
      h1: { count: 1, optimized: true },
      h2: { count: 3, distribution: true },
      h3: { count: 5, structure: true }
    },
    images: {
      total: 3,
      withAlt: 3,
      optimized: 2,
      webp: 1,
      lazy: 2
    },
    links: {
      internal: 5,
      external: 3,
      broken: 0,
      nofollow: 1
    },
    schema: {
      present: true,
      types: ['Article', 'Organization'],
      valid: true
    }
  },
  content: {
    wordCount: 850,
    readabilityScore: 75,
    keywordDensity: 2.2,
    contentStructure: {
      introduction: true,
      conclusion: true,
      subheadings: true,
      lists: true,
      tables: false
    },
    duplicateContent: {
      internal: 0,
      external: 0
    },
    freshness: {
      lastUpdated: new Date(),
      frequency: 'weekly',
      relevance: 85
    }
  },
  performance: {
    pageSpeed: {
      desktop: 92,
      mobile: 78,
      fcp: 1.2,
      lcp: 2.1,
      cls: 0.05
    },
    coreWebVitals: {
      passed: true,
      issues: []
    },
    mobileOptimization: {
      responsive: true,
      viewport: true,
      touchTargets: true
    }
  }
})

// Test Helpers
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

export const mockApiResponse = <T>(data: T, delay: number = 100): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay))

export const mockApiError = (message: string, delay: number = 100): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay))

// Validation Helpers
export const validateBlogPost = (post: BlogPost): string[] => {
  const errors: string[] = []
  
  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!post.content || post.content.trim().length === 0) {
    errors.push('Content is required')
  }
  
  if (!post.author || !post.author.id) {
    errors.push('Author is required')
  }
  
  if (post.title && post.title.length > 200) {
    errors.push('Title is too long (max 200 characters)')
  }
  
  if (post.excerpt && post.excerpt.length > 500) {
    errors.push('Excerpt is too long (max 500 characters)')
  }
  
  return errors
}

export const validatePlatformCredentials = (credentials: PlatformCredentials): string[] => {
  const errors: string[] = []
  
  if (!credentials.platform) {
    errors.push('Platform is required')
  }
  
  if (!credentials.accessToken) {
    errors.push('Access token is required')
  }
  
  if (credentials.expiresAt && credentials.expiresAt < new Date()) {
    errors.push('Access token has expired')
  }
  
  return errors
}

// Performance Testing Helpers
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> => {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = end - start
  
  console.log(`${label}: ${duration.toFixed(2)}ms`)
  
  return { result, duration }
}

export const runLoadTest = async <T>(
  fn: () => Promise<T>,
  iterations: number,
  concurrency: number = 1
): Promise<{ results: T[]; avgDuration: number; maxDuration: number; minDuration: number }> => {
  const results: T[] = []
  const durations: number[] = []
  
  const batches = Math.ceil(iterations / concurrency)
  
  for (let batch = 0; batch < batches; batch++) {
    const batchPromises: Promise<{ result: T; duration: number }>[] = []
    const batchSize = Math.min(concurrency, iterations - batch * concurrency)
    
    for (let i = 0; i < batchSize; i++) {
      batchPromises.push(measurePerformance(fn, `Iteration ${batch * concurrency + i + 1}`))
    }
    
    const batchResults = await Promise.all(batchPromises)
    
    batchResults.forEach(({ result, duration }) => {
      results.push(result)
      durations.push(duration)
    })
  }
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
  const maxDuration = Math.max(...durations)
  const minDuration = Math.min(...durations)
  
  return { results, avgDuration, maxDuration, minDuration }
}

// Integration Test Helpers
export const createTestEnvironment = () => ({
  cleanup: [] as (() => void)[],
  
  addCleanup: function(fn: () => void) {
    this.cleanup.push(fn)
  },
  
  teardown: function() {
    this.cleanup.forEach(fn => fn())
    this.cleanup = []
  }
})

// Mock Browser APIs
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(key => delete store[key]) },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null
  }
}

export const mockSessionStorage = mockLocalStorage

export const mockFetch = (responses: Record<string, any>) => {
  return jest.fn((url: string, options?: RequestInit) => {
    const response = responses[url]
    
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`))
    }
    
    return Promise.resolve({
      ok: response.ok !== false,
      status: response.status || 200,
      json: () => Promise.resolve(response.data || response),
      text: () => Promise.resolve(JSON.stringify(response.data || response))
    })
  })
}

// Export all utilities
export default {
  createMockBlogPost,
  createMockPlatformCredentials,
  createMockAdaptedContent,
  createMockPostResult,
  createMockAnalyticsEvent,
  createMockAnalyticsMetrics,
  createMockEmailTemplate,
  createMockEmailCampaign,
  createMockEmailRecipient,
  createMockSEOAnalysis,
  delay,
  mockApiResponse,
  mockApiError,
  validateBlogPost,
  validatePlatformCredentials,
  measurePerformance,
  runLoadTest,
  createTestEnvironment,
  mockLocalStorage,
  mockSessionStorage,
  mockFetch
}
