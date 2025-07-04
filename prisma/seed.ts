import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default platforms
  const platforms = [
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      description: 'Professional networking platform',
      category: 'professional',
      iconUrl: '/icons/linkedin.png',
      websiteUrl: 'https://linkedin.com',
      apiEndpoint: 'https://api.linkedin.com/v2',
      authType: 'oauth',
      rateLimitPerHour: 100,
      rateLimitPerDay: 2000,
      maxContentLength: 3000,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      status: 'ACTIVE'
    },
    {
      name: 'medium',
      displayName: 'Medium',
      description: 'Publishing platform for writers',
      category: 'blogging',
      iconUrl: '/icons/medium.png',
      websiteUrl: 'https://medium.com',
      apiEndpoint: 'https://api.medium.com/v1',
      authType: 'oauth',
      rateLimitPerHour: 500,
      rateLimitPerDay: 10000,
      maxContentLength: 100000,
      supportsImages: true,
      supportsVideo: false,
      supportsHashtags: true,
      supportsMentions: false,
      supportsScheduling: false,
      status: 'ACTIVE'
    },
    {
      name: 'twitter',
      displayName: 'Twitter/X',
      description: 'Social media platform',
      category: 'social',
      iconUrl: '/icons/twitter.png',
      websiteUrl: 'https://twitter.com',
      apiEndpoint: 'https://api.twitter.com/2',
      authType: 'oauth',
      rateLimitPerHour: 300,
      rateLimitPerDay: 2000,
      maxContentLength: 280,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      status: 'ACTIVE'
    },
    {
      name: 'dev',
      displayName: 'DEV Community',
      description: 'Community for software developers',
      category: 'blogging',
      iconUrl: '/icons/dev.png',
      websiteUrl: 'https://dev.to',
      apiEndpoint: 'https://dev.to/api',
      authType: 'api_key',
      rateLimitPerHour: 1000,
      rateLimitPerDay: 10000,
      maxContentLength: 100000,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: false,
      status: 'ACTIVE'
    },
    {
      name: 'hashnode',
      displayName: 'Hashnode',
      description: 'Blogging platform for developers',
      category: 'blogging',
      iconUrl: '/icons/hashnode.png',
      websiteUrl: 'https://hashnode.com',
      apiEndpoint: 'https://api.hashnode.com',
      authType: 'api_key',
      rateLimitPerHour: 500,
      rateLimitPerDay: 5000,
      maxContentLength: 100000,
      supportsImages: true,
      supportsVideo: true,
      supportsHashtags: true,
      supportsMentions: true,
      supportsScheduling: true,
      status: 'ACTIVE'
    }
  ]

  // Create or update platforms
  for (const platform of platforms) {
    await prisma.platform.upsert({
      where: { name: platform.name },
      update: platform,
      create: platform
    })
  }

  // Create default categories
  const categories = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Articles about technology, programming, and software development',
      color: '#3B82F6'
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Business insights, entrepreneurship, and industry news',
      color: '#10B981'
    },
    {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Personal development, health, and lifestyle content',
      color: '#F59E0B'
    },
    {
      name: 'Education',
      slug: 'education',
      description: 'Educational content, tutorials, and learning resources',
      color: '#8B5CF6'
    }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    })
  }

  // Create default tags
  const tags = [
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'React', slug: 'react', color: '#61DAFB' },
    { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    { name: 'Node.js', slug: 'nodejs', color: '#339933' },
    { name: 'AI', slug: 'ai', color: '#FF6B6B' },
    { name: 'Machine Learning', slug: 'machine-learning', color: '#4ECDC4' },
    { name: 'Web Development', slug: 'web-development', color: '#45B7D1' },
    { name: 'Mobile Development', slug: 'mobile-development', color: '#96CEB4' },
    { name: 'DevOps', slug: 'devops', color: '#FFEAA7' }
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag
    })
  }

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@blogplatform.com' },
    update: {},
    create: {
      email: 'admin@blogplatform.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      bio: 'Platform administrator with full access to all features',
      emailNotifications: true,
      marketingEmails: false
    }
  })

  // Create demo editor user
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@blogplatform.com' },
    update: {},
    create: {
      email: 'editor@blogplatform.com',
      name: 'Editor User',
      role: 'EDITOR',
      emailVerified: new Date(),
      bio: 'Content editor with post and category management access',
      emailNotifications: true,
      marketingEmails: true
    }
  })

  // Create demo viewer user
  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@blogplatform.com' },
    update: {},
    create: {
      email: 'viewer@blogplatform.com',
      name: 'Viewer User',
      role: 'VIEWER',
      emailVerified: new Date(),
      bio: 'Regular user with read-only access',
      emailNotifications: false,
      marketingEmails: false
    }
  })

  // Create sample SEO keywords
  const keywords = [
    { keyword: 'web development', difficulty: 45, volume: 12000, cpc: 2.5 },
    { keyword: 'javascript tutorial', difficulty: 35, volume: 8000, cpc: 1.8 },
    { keyword: 'react hooks', difficulty: 50, volume: 6000, cpc: 3.2 },
    { keyword: 'node.js api', difficulty: 40, volume: 4500, cpc: 2.8 },
    { keyword: 'typescript guide', difficulty: 42, volume: 3500, cpc: 2.1 }
  ]

  for (const keyword of keywords) {
    await prisma.sEOKeyword.upsert({
      where: { keyword: keyword.keyword },
      update: keyword,
      create: keyword
    })
  }

  // Get category IDs for sample posts
  const techCategory = await prisma.category.findFirst({ where: { name: 'Technology' } })
  const businessCategory = await prisma.category.findFirst({ where: { name: 'Business' } })

  if (!techCategory || !businessCategory) {
    throw new Error('Required categories not found')
  }

  // Create sample blog posts
  const samplePosts = [
    {
      title: "The Complete Guide to AI-Powered Content Distribution",
      slug: "ai-powered-content-distribution-guide",
      content: `# The Complete Guide to AI-Powered Content Distribution

Content distribution has been revolutionized by artificial intelligence, offering creators unprecedented opportunities to reach their audience across multiple platforms simultaneously.

## Understanding AI-Powered Distribution

AI-powered content distribution uses machine learning algorithms to analyze your content, understand your audience, and automatically adapt your posts for different platforms while maintaining your brand voice and message consistency.

## Key Benefits

- **Time Efficiency**: Automate posting across 1000+ platforms
- **Personalization**: Tailor content for each platform's audience
- **Optimization**: Use AI to determine the best posting times
- **Analytics**: Get detailed insights on cross-platform performance

## Getting Started

1. Choose your content distribution platform
2. Connect your social media accounts
3. Set up your brand guidelines
4. Let AI handle the rest

The future of content creation lies in smart automation that amplifies your reach while preserving your authentic voice.`,
      excerpt: "Learn how artificial intelligence is revolutionizing content distribution across 1000+ platforms. Discover strategies, tools, and best practices for maximizing your reach.",
      featuredImage: "https://picsum.photos/800/400?random=1001",
      readingTime: 12,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metaTitle: "AI-Powered Content Distribution Guide | Universal Blog Platform",
      metaDescription: "Master AI-powered content distribution with our comprehensive guide. Learn to reach 1000+ platforms automatically.",
      authorId: adminUser.id,
      categoryId: techCategory.id
    },
    {
      title: "Building Your Personal Brand Across Multiple Platforms",
      slug: "building-personal-brand-multiple-platforms",
      content: `# Building Your Personal Brand Across Multiple Platforms

In today's digital landscape, having a strong personal brand isn't just nice to have—it's essential for professional success.

## The Multi-Platform Approach

Your personal brand should be consistent yet tailored for each platform:

### LinkedIn: Professional Focus
- Share industry insights
- Publish long-form articles
- Engage with professional content

### Twitter: Real-time Engagement
- Share quick thoughts and updates
- Participate in conversations
- Use relevant hashtags

### Medium: Thought Leadership
- Write detailed articles
- Share expertise and experiences
- Build a following of engaged readers

## Brand Consistency Tips

1. **Visual Identity**: Use the same profile picture and colors
2. **Voice and Tone**: Maintain consistent messaging
3. **Content Themes**: Focus on your core expertise areas
4. **Engagement Style**: Be authentic and consistent

Building a personal brand takes time, but with the right strategy and tools, you can establish yourself as a thought leader in your industry.`,
      excerpt: "Master the art of consistent personal branding across social media, blogging platforms, and professional networks. A comprehensive strategy guide.",
      featuredImage: "https://picsum.photos/800/400?random=1002",
      readingTime: 8,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metaTitle: "Personal Branding Across Multiple Platforms | Complete Guide",
      metaDescription: "Learn to build a consistent personal brand across all social media and professional platforms with proven strategies.",
      authorId: adminUser.id,
      categoryId: businessCategory.id
    },
    {
      title: "Analytics Deep Dive: Understanding Cross-Platform Metrics",
      slug: "cross-platform-analytics-metrics-guide",
      content: `# Analytics Deep Dive: Understanding Cross-Platform Metrics

Analytics can make or break your content strategy. Understanding what metrics matter and how to track them across platforms is crucial for success.

## Key Metrics to Track

### Engagement Metrics
- Likes, shares, comments
- Click-through rates
- Time spent reading
- Social shares

### Reach Metrics
- Impressions
- Unique viewers
- Follower growth
- Platform-specific reach

### Conversion Metrics
- Newsletter signups
- Website visits
- Lead generation
- Sales attribution

## Cross-Platform Analysis

Different platforms require different approaches:

**Social Media**: Focus on engagement and reach
**Blog Platforms**: Emphasize reading time and depth
**Professional Networks**: Track leads and connections
**Video Platforms**: Monitor watch time and retention

## Tools and Techniques

1. **Google Analytics**: Track website traffic from all platforms
2. **Platform Native Analytics**: Use built-in tools for each platform
3. **Third-party Tools**: Consolidate data for comprehensive analysis
4. **Custom Dashboards**: Create unified reporting systems

The key is to focus on metrics that align with your goals and provide actionable insights for improvement.`,
      excerpt: "Decode the complex world of cross-platform analytics. Learn which metrics matter most and how to track performance across all your distribution channels.",
      featuredImage: "https://picsum.photos/800/400?random=1003",
      readingTime: 15,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      metaTitle: "Cross-Platform Analytics Guide | Track Performance Everywhere",
      metaDescription: "Master cross-platform analytics with our comprehensive guide to tracking metrics across all your content distribution channels.",
      authorId: adminUser.id,
      categoryId: businessCategory.id
    }
  ]

  for (const post of samplePosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created ${platforms.length} platforms`)
  console.log(`📁 Created ${categories.length} categories`) 
  console.log(`🏷️ Created ${tags.length} tags`)
  console.log(`👤 Created admin user: ${adminUser.email}`)
  console.log(`👤 Created editor user: ${editorUser.email}`)
  console.log(`👤 Created viewer user: ${viewerUser.email}`)
  console.log(`🔍 Created ${keywords.length} SEO keywords`)
  console.log(`📝 Created ${samplePosts.length} sample posts`)
  
  console.log('\n🎯 DEMO LOGIN CREDENTIALS:')
  console.log('=================================')
  console.log('🔑 ADMIN ACCESS:')
  console.log('   Email: admin@blogplatform.com')
  console.log('   Role: ADMIN (Full Access)')
  console.log('')
  console.log('📝 EDITOR ACCESS:')
  console.log('   Email: editor@blogplatform.com') 
  console.log('   Role: EDITOR (Content Management)')
  console.log('')
  console.log('👁️ VIEWER ACCESS:')
  console.log('   Email: viewer@blogplatform.com')
  console.log('   Role: VIEWER (Read Only)')
  console.log('=================================')
  console.log('💡 Note: This app uses OAuth. Use these emails with Google/GitHub OAuth')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
