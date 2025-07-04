/**
 * Advanced SEO Analysis Service
 * Provides comprehensive SEO analysis, optimization suggestions, and monitoring
 */

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  suggestions: SEOSuggestion[]
  keywords: KeywordAnalysis
  technical: TechnicalSEO
  content: ContentSEO
  performance: PerformanceSEO
}

export interface SEOIssue {
  type: 'critical' | 'warning' | 'info'
  category: 'content' | 'technical' | 'performance' | 'keywords'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  fix: string
  priority: number
}

export interface SEOSuggestion {
  type: 'optimization' | 'enhancement' | 'best-practice'
  title: string
  description: string
  implementation: string
  expectedImpact: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface KeywordAnalysis {
  primary: string[]
  secondary: string[]
  longtail: string[]
  density: Record<string, number>
  distribution: Record<string, number>
  opportunities: string[]
  competition: Record<string, 'low' | 'medium' | 'high'>
  searchVolume: Record<string, number>
  trends: Record<string, number[]>
}

export interface TechnicalSEO {
  metaTags: {
    title: { present: boolean; length: number; optimized: boolean }
    description: { present: boolean; length: number; optimized: boolean }
    keywords: { present: boolean; count: number }
    robots: { present: boolean; value: string }
    canonical: { present: boolean; url: string }
    openGraph: { present: boolean; complete: boolean }
    twitterCard: { present: boolean; complete: boolean }
  }
  headings: {
    h1: { count: number; optimized: boolean }
    h2: { count: number; distribution: boolean }
    h3: { count: number; structure: boolean }
  }
  images: {
    total: number
    withAlt: number
    optimized: number
    webp: number
    lazy: number
  }
  links: {
    internal: number
    external: number
    broken: number
    nofollow: number
  }
  schema: {
    present: boolean
    types: string[]
    valid: boolean
  }
}

export interface ContentSEO {
  wordCount: number
  readabilityScore: number
  keywordDensity: number
  contentStructure: {
    introduction: boolean
    conclusion: boolean
    subheadings: boolean
    lists: boolean
    tables: boolean
  }
  duplicateContent: {
    internal: number
    external: number
  }
  freshness: {
    lastUpdated: Date
    frequency: string
    relevance: number
  }
}

export interface PerformanceSEO {
  pageSpeed: {
    desktop: number
    mobile: number
    fcp: number
    lcp: number
    cls: number
  }
  coreWebVitals: {
    passed: boolean
    issues: string[]
  }
  mobileOptimization: {
    responsive: boolean
    viewport: boolean
    touchTargets: boolean
  }
}

export interface SEOCompetitorAnalysis {
  competitor: string
  domain: string
  keywords: {
    shared: string[]
    unique: string[]
    ranking: Record<string, number>
  }
  content: {
    topics: string[]
    gaps: string[]
    opportunities: string[]
  }
  backlinks: {
    count: number
    quality: number
    domains: number
  }
}

class SEOService {
  /**
   * Analyze content for SEO optimization
   */
  async analyzeContent(content: string, url?: string, metadata?: any): Promise<SEOAnalysis> {
    const analysis: SEOAnalysis = {
      score: 0,
      issues: [],
      suggestions: [],
      keywords: await this.analyzeKeywords(content),
      technical: await this.analyzeTechnical(content, metadata),
      content: await this.analyzeContentSEO(content),
      performance: await this.analyzePerformance(url)
    }

    // Calculate overall score
    analysis.score = this.calculateSEOScore(analysis)

    // Generate issues and suggestions
    analysis.issues = this.generateIssues(analysis)
    analysis.suggestions = this.generateSuggestions(analysis)

    return analysis
  }

  /**
   * Analyze keywords in content
   */
  private async analyzeKeywords(content: string): Promise<KeywordAnalysis> {
    const words = content.toLowerCase().match(/\b\w+\b/g) || []
    const wordCount = words.length
    
    // Extract potential keywords (2-4 word phrases)
    const phrases = this.extractPhrases(content)
    
    // Mock keyword data (in real implementation, use keyword research APIs)
    const mockKeywords = {
      primary: ['web development', 'javascript', 'react'],
      secondary: ['frontend', 'programming', 'coding'],
      longtail: ['how to learn web development', 'best javascript frameworks', 'react hooks tutorial']
    }

    const density: Record<string, number> = {}
    const distribution: Record<string, number> = {}
    const competition: Record<string, 'low' | 'medium' | 'high'> = {}
    const searchVolume: Record<string, number> = {}
    const trends: Record<string, number[]> = {}

    // Calculate keyword density and distribution
    const allKeywords = [...mockKeywords.primary, ...mockKeywords.secondary]
    allKeywords.forEach(keyword => {
      const occurrences = (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length
      density[keyword] = (occurrences / wordCount) * 100
      distribution[keyword] = this.calculateKeywordDistribution(content, keyword)
      
      // Mock data
      competition[keyword] = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
      searchVolume[keyword] = Math.floor(Math.random() * 10000) + 1000
      trends[keyword] = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
    })

    return {
      primary: mockKeywords.primary,
      secondary: mockKeywords.secondary,
      longtail: mockKeywords.longtail,
      density,
      distribution,
      opportunities: ['machine learning', 'artificial intelligence', 'automation'],
      competition,
      searchVolume,
      trends
    }
  }

  /**
   * Analyze technical SEO aspects
   */
  private async analyzeTechnical(content: string, metadata?: any): Promise<TechnicalSEO> {
    const headings = this.extractHeadings(content)
    const images = this.extractImages(content)
    const links = this.extractLinks(content)

    return {
      metaTags: {
        title: {
          present: !!metadata?.title,
          length: metadata?.title?.length || 0,
          optimized: metadata?.title?.length >= 30 && metadata?.title?.length <= 60
        },
        description: {
          present: !!metadata?.description,
          length: metadata?.description?.length || 0,
          optimized: metadata?.description?.length >= 120 && metadata?.description?.length <= 160
        },
        keywords: {
          present: !!metadata?.keywords,
          count: metadata?.keywords?.length || 0
        },
        robots: {
          present: !!metadata?.robots,
          value: metadata?.robots || 'index,follow'
        },
        canonical: {
          present: !!metadata?.canonical,
          url: metadata?.canonical || ''
        },
        openGraph: {
          present: !!metadata?.openGraph,
          complete: !!(metadata?.openGraph?.title && metadata?.openGraph?.description && metadata?.openGraph?.image)
        },
        twitterCard: {
          present: !!metadata?.twitterCard,
          complete: !!(metadata?.twitterCard?.title && metadata?.twitterCard?.description)
        }
      },
      headings: {
        h1: {
          count: headings.h1.length,
          optimized: headings.h1.length === 1
        },
        h2: {
          count: headings.h2.length,
          distribution: headings.h2.length >= 2 && headings.h2.length <= 6
        },
        h3: {
          count: headings.h3.length,
          structure: headings.h3.length > 0
        }
      },
      images: {
        total: images.length,
        withAlt: images.filter(img => img.alt).length,
        optimized: Math.floor(images.length * 0.8), // Mock
        webp: Math.floor(images.length * 0.6), // Mock
        lazy: Math.floor(images.length * 0.7) // Mock
      },
      links: {
        internal: links.internal.length,
        external: links.external.length,
        broken: Math.floor(links.external.length * 0.1), // Mock
        nofollow: Math.floor(links.external.length * 0.3) // Mock
      },
      schema: {
        present: !!metadata?.schema,
        types: metadata?.schema?.types || [],
        valid: !!metadata?.schema?.valid
      }
    }
  }

  /**
   * Analyze content SEO factors
   */
  private async analyzeContentSEO(content: string): Promise<ContentSEO> {
    const wordCount = (content.match(/\b\w+\b/g) || []).length
    const readabilityScore = this.calculateReadabilityScore(content)

    return {
      wordCount,
      readabilityScore,
      keywordDensity: 2.5, // Mock
      contentStructure: {
        introduction: content.toLowerCase().includes('introduction') || content.length > 200,
        conclusion: content.toLowerCase().includes('conclusion') || content.toLowerCase().includes('summary'),
        subheadings: (content.match(/#{2,6}\s/g) || []).length > 0,
        lists: (content.match(/^\s*[-*+]\s/gm) || []).length > 0,
        tables: (content.match(/\|.*\|/g) || []).length > 0
      },
      duplicateContent: {
        internal: 0, // Mock
        external: 0 // Mock
      },
      freshness: {
        lastUpdated: new Date(),
        frequency: 'weekly',
        relevance: 85
      }
    }
  }

  /**
   * Analyze performance SEO factors
   */
  private async analyzePerformance(url?: string): Promise<PerformanceSEO> {
    // Mock performance data (in real implementation, use PageSpeed Insights API)
    return {
      pageSpeed: {
        desktop: Math.floor(Math.random() * 20) + 80,
        mobile: Math.floor(Math.random() * 25) + 70,
        fcp: Math.random() * 2 + 1,
        lcp: Math.random() * 3 + 2,
        cls: Math.random() * 0.1
      },
      coreWebVitals: {
        passed: Math.random() > 0.3,
        issues: ['Largest Contentful Paint', 'Cumulative Layout Shift']
      },
      mobileOptimization: {
        responsive: true,
        viewport: true,
        touchTargets: Math.random() > 0.2
      }
    }
  }

  /**
   * Calculate overall SEO score
   */
  private calculateSEOScore(analysis: SEOAnalysis): number {
    let score = 0
    let maxScore = 0

    // Technical SEO (30%)
    const technicalScore = this.calculateTechnicalScore(analysis.technical)
    score += technicalScore * 0.3
    maxScore += 30

    // Content SEO (40%)
    const contentScore = this.calculateContentScore(analysis.content)
    score += contentScore * 0.4
    maxScore += 40

    // Performance SEO (20%)
    const performanceScore = this.calculatePerformanceScore(analysis.performance)
    score += performanceScore * 0.2
    maxScore += 20

    // Keywords (10%)
    const keywordScore = this.calculateKeywordScore(analysis.keywords)
    score += keywordScore * 0.1
    maxScore += 10

    return Math.round((score / maxScore) * 100)
  }

  /**
   * Generate SEO issues
   */
  private generateIssues(analysis: SEOAnalysis): SEOIssue[] {
    const issues: SEOIssue[] = []

    // Technical issues
    if (!analysis.technical.metaTags.title.present) {
      issues.push({
        type: 'critical',
        category: 'technical',
        title: 'Missing Title Tag',
        description: 'The page is missing a title tag, which is crucial for SEO.',
        impact: 'high',
        fix: 'Add a descriptive title tag between 30-60 characters.',
        priority: 1
      })
    }

    if (!analysis.technical.metaTags.description.present) {
      issues.push({
        type: 'critical',
        category: 'technical',
        title: 'Missing Meta Description',
        description: 'The page is missing a meta description.',
        impact: 'high',
        fix: 'Add a compelling meta description between 120-160 characters.',
        priority: 2
      })
    }

    if (analysis.technical.headings.h1.count !== 1) {
      issues.push({
        type: 'warning',
        category: 'content',
        title: 'H1 Tag Issues',
        description: `Found ${analysis.technical.headings.h1.count} H1 tags. Should have exactly 1.`,
        impact: 'medium',
        fix: 'Use exactly one H1 tag per page for the main heading.',
        priority: 3
      })
    }

    // Content issues
    if (analysis.content.wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        title: 'Low Word Count',
        description: 'Content is too short for good SEO performance.',
        impact: 'medium',
        fix: 'Expand content to at least 300 words with valuable information.',
        priority: 4
      })
    }

    // Performance issues
    if (analysis.performance.pageSpeed.mobile < 70) {
      issues.push({
        type: 'warning',
        category: 'performance',
        title: 'Poor Mobile Performance',
        description: 'Mobile page speed is below recommended threshold.',
        impact: 'medium',
        fix: 'Optimize images, minify CSS/JS, and improve server response time.',
        priority: 5
      })
    }

    return issues.sort((a, b) => a.priority - b.priority)
  }

  /**
   * Generate SEO suggestions
   */
  private generateSuggestions(analysis: SEOAnalysis): SEOSuggestion[] {
    const suggestions: SEOSuggestion[] = []

    suggestions.push({
      type: 'optimization',
      title: 'Add Schema Markup',
      description: 'Implement structured data to help search engines understand your content.',
      implementation: 'Add JSON-LD schema markup for Article, Organization, or relevant types.',
      expectedImpact: 'Improved rich snippets and search visibility',
      difficulty: 'medium'
    })

    suggestions.push({
      type: 'enhancement',
      title: 'Optimize Images',
      description: 'Improve image optimization for better performance and SEO.',
      implementation: 'Convert images to WebP format, add descriptive alt text, implement lazy loading.',
      expectedImpact: 'Better page speed and accessibility',
      difficulty: 'easy'
    })

    suggestions.push({
      type: 'best-practice',
      title: 'Internal Linking',
      description: 'Add more internal links to improve site structure and user navigation.',
      implementation: 'Link to related articles and important pages using descriptive anchor text.',
      expectedImpact: 'Better crawlability and user engagement',
      difficulty: 'easy'
    })

    return suggestions
  }

  // Helper methods
  private extractPhrases(content: string): string[] {
    // Simple phrase extraction (2-4 words)
    const words = content.toLowerCase().match(/\b\w+\b/g) || []
    const phrases: string[] = []
    
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(words.slice(i, i + 2).join(' '))
      if (i < words.length - 2) {
        phrases.push(words.slice(i, i + 3).join(' '))
      }
    }
    
    return phrases
  }

  private calculateKeywordDistribution(content: string, keyword: string): number {
    const sections = content.split('\n\n')
    const sectionsWithKeyword = sections.filter(section => 
      section.toLowerCase().includes(keyword.toLowerCase())
    ).length
    
    return (sectionsWithKeyword / sections.length) * 100
  }

  private extractHeadings(content: string) {
    return {
      h1: (content.match(/^#\s.+$/gm) || []),
      h2: (content.match(/^##\s.+$/gm) || []),
      h3: (content.match(/^###\s.+$/gm) || [])
    }
  }

  private extractImages(content: string) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images: Array<{ alt: string; src: string }> = []
    let match

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1],
        src: match[2]
      })
    }

    return images
  }

  private extractLinks(content: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const internal: string[] = []
    const external: string[] = []
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2]
      if (url.startsWith('http') && (typeof window === 'undefined' || !url.includes(window.location.hostname))) {
        external.push(url)
      } else {
        internal.push(url)
      }
    }

    return { internal, external }
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease calculation
    const sentences = content.split(/[.!?]+/).length
    const words = (content.match(/\b\w+\b/g) || []).length
    const syllables = this.countSyllables(content)

    if (sentences === 0 || words === 0) return 0

    const avgSentenceLength = words / sentences
    const avgSyllablesPerWord = syllables / words

    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  private countSyllables(text: string): number {
    return (text.toLowerCase().match(/[aeiouy]+/g) || []).length
  }

  private calculateTechnicalScore(technical: TechnicalSEO): number {
    let score = 0
    let maxScore = 0

    // Meta tags (40%)
    if (technical.metaTags.title.present) score += 10
    if (technical.metaTags.title.optimized) score += 5
    if (technical.metaTags.description.present) score += 10
    if (technical.metaTags.description.optimized) score += 5
    if (technical.metaTags.openGraph.present) score += 5
    if (technical.metaTags.openGraph.complete) score += 5
    maxScore += 40

    // Headings (30%)
    if (technical.headings.h1.optimized) score += 15
    if (technical.headings.h2.distribution) score += 10
    if (technical.headings.h3.structure) score += 5
    maxScore += 30

    // Images (20%)
    const imageOptimization = (technical.images.withAlt / Math.max(technical.images.total, 1)) * 20
    score += imageOptimization
    maxScore += 20

    // Links (10%)
    if (technical.links.internal > 0) score += 5
    if (technical.links.broken === 0) score += 5
    maxScore += 10

    return (score / maxScore) * 100
  }

  private calculateContentScore(content: ContentSEO): number {
    let score = 0
    let maxScore = 100

    // Word count (30%)
    if (content.wordCount >= 300) score += 15
    if (content.wordCount >= 600) score += 10
    if (content.wordCount >= 1000) score += 5

    // Readability (25%)
    score += (content.readabilityScore / 100) * 25

    // Structure (25%)
    if (content.contentStructure.introduction) score += 5
    if (content.contentStructure.conclusion) score += 5
    if (content.contentStructure.subheadings) score += 5
    if (content.contentStructure.lists) score += 5
    if (content.contentStructure.tables) score += 5

    // Keyword density (20%)
    if (content.keywordDensity >= 1 && content.keywordDensity <= 3) score += 20

    return Math.min(score, maxScore)
  }

  private calculatePerformanceScore(performance: PerformanceSEO): number {
    let score = 0

    // Page speed (60%)
    score += (performance.pageSpeed.desktop / 100) * 30
    score += (performance.pageSpeed.mobile / 100) * 30

    // Core Web Vitals (40%)
    if (performance.coreWebVitals.passed) score += 40

    return Math.min(score, 100)
  }

  private calculateKeywordScore(keywords: KeywordAnalysis): number {
    let score = 0

    // Primary keywords presence (50%)
    if (keywords.primary.length > 0) score += 25
    if (keywords.primary.length >= 3) score += 25

    // Keyword density (30%)
    const avgDensity = Object.values(keywords.density).reduce((a, b) => a + b, 0) / Object.values(keywords.density).length
    if (avgDensity >= 1 && avgDensity <= 3) score += 30

    // Long-tail keywords (20%)
    if (keywords.longtail.length > 0) score += 10
    if (keywords.longtail.length >= 3) score += 10

    return Math.min(score, 100)
  }

  /**
   * Get keyword suggestions based on content
   */
  async getKeywordSuggestions(content: string, topic?: string): Promise<string[]> {
    // Mock keyword suggestions (in real implementation, use keyword research APIs)
    const suggestions = [
      'web development trends',
      'javascript best practices',
      'react performance optimization',
      'frontend development tools',
      'modern web technologies',
      'responsive web design',
      'web accessibility',
      'progressive web apps',
      'web performance optimization',
      'mobile-first development'
    ]

    return suggestions.slice(0, 10)
  }

  /**
   * Analyze competitor SEO
   */
  async analyzeCompetitors(keywords: string[]): Promise<SEOCompetitorAnalysis[]> {
    // Mock competitor analysis
    const competitors = [
      'example-competitor1.com',
      'example-competitor2.com',
      'example-competitor3.com'
    ]

    return competitors.map(domain => ({
      competitor: domain.replace('.com', '').replace('-', ' '),
      domain,
      keywords: {
        shared: keywords.slice(0, 3),
        unique: ['unique keyword 1', 'unique keyword 2'],
        ranking: keywords.reduce((acc, keyword) => {
          acc[keyword] = Math.floor(Math.random() * 50) + 1
          return acc
        }, {} as Record<string, number>)
      },
      content: {
        topics: ['web development', 'programming', 'technology'],
        gaps: ['AI integration', 'mobile development'],
        opportunities: ['tutorial content', 'case studies']
      },
      backlinks: {
        count: Math.floor(Math.random() * 10000) + 1000,
        quality: Math.floor(Math.random() * 40) + 60,
        domains: Math.floor(Math.random() * 500) + 100
      }
    }))
  }
}

// Export singleton instance
export const seoService = new SEOService()
