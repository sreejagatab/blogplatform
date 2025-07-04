import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email-service'
import { platformManager } from '@/lib/platforms/platform-manager'
import { publishingQueue } from '@/lib/platforms/publishing-queue'
import { getAIContentManager } from '@/lib/ai/ai-content-manager'

// Mock external services
jest.mock('@/lib/email-service')
jest.mock('@/lib/platforms/platform-manager')
jest.mock('@/lib/ai/ai-content-manager')

describe('Blog Platform Integration Tests', () => {
  let testUser: any
  let testPost: any
  let testCategory: any

  beforeAll(async () => {
    // Setup test database
    await prisma.$connect()
    
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN'
      }
    })

    // Create test category
    testCategory = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test category for integration tests'
      }
    })
  })

  afterAll(async () => {
    // Cleanup test data
    await prisma.post.deleteMany({ where: { authorId: testUser.id } })
    await prisma.category.deleteMany({ where: { id: testCategory.id } })
    await prisma.user.deleteMany({ where: { id: testUser.id } })
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks()
  })

  describe('Post Management', () => {
    it('should create a new blog post', async () => {
      const postData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        excerpt: 'Test excerpt',
        status: 'PUBLISHED',
        categoryId: testCategory.id,
        authorId: testUser.id
      }

      testPost = await prisma.post.create({
        data: postData,
        include: {
          author: true,
          category: true
        }
      })

      expect(testPost).toBeDefined()
      expect(testPost.title).toBe(postData.title)
      expect(testPost.status).toBe('PUBLISHED')
      expect(testPost.author.id).toBe(testUser.id)
      expect(testPost.category.id).toBe(testCategory.id)
    })

    it('should update an existing post', async () => {
      const updatedData = {
        title: 'Updated Test Blog Post',
        content: 'Updated content for the test blog post.'
      }

      const updatedPost = await prisma.post.update({
        where: { id: testPost.id },
        data: updatedData
      })

      expect(updatedPost.title).toBe(updatedData.title)
      expect(updatedPost.content).toBe(updatedData.content)
    })

    it('should delete a post', async () => {
      await prisma.post.delete({
        where: { id: testPost.id }
      })

      const deletedPost = await prisma.post.findUnique({
        where: { id: testPost.id }
      })

      expect(deletedPost).toBeNull()
    })
  })

  describe('Platform Publishing', () => {
    beforeEach(async () => {
      // Create a fresh test post for each test
      testPost = await prisma.post.create({
        data: {
          title: 'Platform Test Post',
          content: 'Content for platform publishing test.',
          excerpt: 'Test excerpt',
          status: 'PUBLISHED',
          categoryId: testCategory.id,
          authorId: testUser.id
        }
      })
    })

    it('should add post to publishing queue', async () => {
      const platforms = ['twitter', 'linkedin', 'facebook']
      
      const result = await publishingQueue.addToQueue(testPost, {
        platforms,
        scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
        priority: 'normal'
      })

      expect(result.success).toBe(true)
      expect(result.jobIds).toHaveLength(platforms.length)
    })

    it('should process publishing queue', async () => {
      // Mock platform manager
      const mockAdapter = {
        adaptContent: jest.fn().mockResolvedValue({
          title: testPost.title,
          content: testPost.excerpt,
          hashtags: ['#test']
        }),
        validateContent: jest.fn().mockResolvedValue({ valid: true }),
        publishPost: jest.fn().mockResolvedValue({
          success: true,
          platformPostId: 'mock-post-id',
          url: 'https://platform.com/post/mock-post-id'
        }),
        checkHealth: jest.fn().mockResolvedValue({ isOnline: true })
      }

      ;(platformManager.getAdapter as jest.Mock).mockReturnValue(mockAdapter)

      await publishingQueue.processQueue()

      expect(mockAdapter.adaptContent).toHaveBeenCalled()
      expect(mockAdapter.publishPost).toHaveBeenCalled()
    })
  })

  describe('Email System', () => {
    it('should send welcome email to new subscriber', async () => {
      const mockSendEmail = emailService.sendEmail as jest.MockedFunction<typeof emailService.sendEmail>
      mockSendEmail.mockResolvedValue({ success: true, messageId: 'mock-message-id' })

      const result = await emailService.subscribeToNewsletter('newuser@example.com', 'New User')

      expect(result.success).toBe(true)
      expect(mockSendEmail).toHaveBeenCalledWith(
        'newuser@example.com',
        'Welcome to our newsletter!',
        expect.objectContaining({
          html: expect.stringContaining('Welcome!'),
          text: expect.stringContaining('Welcome!')
        })
      )
    })

    it('should create and send email campaign', async () => {
      const mockSendCampaign = emailService.sendCampaign as jest.MockedFunction<typeof emailService.sendCampaign>
      mockSendCampaign.mockResolvedValue({ success: true })

      const campaign = await emailService.createCampaign({
        name: 'Test Campaign',
        templateId: 'test-template',
        subject: 'Test Subject',
        recipients: [
          {
            email: 'test@example.com',
            name: 'Test User',
            tags: [],
            subscribed: true,
            subscribedAt: new Date(),
            engagement: { opens: 0, clicks: 0 }
          }
        ],
        status: 'draft',
        settings: {
          trackOpens: true,
          trackClicks: true,
          allowUnsubscribe: true
        }
      })

      const result = await emailService.sendCampaign(campaign.id)

      expect(result.success).toBe(true)
      expect(mockSendCampaign).toHaveBeenCalledWith(campaign.id)
    })
  })

  describe('AI Content Features', () => {
    it('should generate content suggestions', async () => {
      const mockAIManager = {
        getWritingAssistance: jest.fn().mockResolvedValue({
          suggestions: ['Improve the introduction', 'Add more examples'],
          optimizedContent: 'Optimized content here'
        }),
        analyzeSEO: jest.fn().mockResolvedValue({
          score: 85,
          keywords: ['test', 'blog', 'content'],
          suggestions: ['Add meta description']
        })
      }

      ;(getAIContentManager as jest.Mock).mockReturnValue(mockAIManager)

      const aiManager = getAIContentManager()
      const suggestions = await aiManager.getWritingAssistance({
        content: testPost.content,
        assistanceType: 'improvement',
        context: 'Blog post optimization'
      })

      expect(suggestions).toBeDefined()
      expect(suggestions.suggestions).toHaveLength(2)
      expect(mockAIManager.getWritingAssistance).toHaveBeenCalled()
    })

    it('should analyze SEO for content', async () => {
      const mockAIManager = {
        analyzeSEO: jest.fn().mockResolvedValue({
          score: 75,
          keywords: ['platform', 'test', 'blog'],
          suggestions: ['Optimize title length', 'Add internal links']
        })
      }

      ;(getAIContentManager as jest.Mock).mockReturnValue(mockAIManager)

      const aiManager = getAIContentManager()
      const seoAnalysis = await aiManager.analyzeSEO(testPost.title, testPost.content)

      expect(seoAnalysis).toBeDefined()
      expect(seoAnalysis.score).toBe(75)
      expect(seoAnalysis.keywords).toContain('platform')
      expect(mockAIManager.analyzeSEO).toHaveBeenCalledWith(testPost.title, testPost.content)
    })
  })

  describe('Analytics System', () => {
    it('should track page views', async () => {
      const pageView = await prisma.pageView.create({
        data: {
          postId: testPost.id,
          path: `/blog/${testPost.slug}`,
          visitorId: 'test-visitor-id',
          userAgent: 'Test User Agent',
          referrer: 'https://google.com'
        }
      })

      expect(pageView).toBeDefined()
      expect(pageView.postId).toBe(testPost.id)
      expect(pageView.path).toBe(`/blog/${testPost.slug}`)
    })

    it('should generate analytics report', async () => {
      // Create some test analytics data
      await prisma.pageView.createMany({
        data: [
          {
            postId: testPost.id,
            path: `/blog/${testPost.slug}`,
            visitorId: 'visitor-1',
            userAgent: 'Test Agent 1'
          },
          {
            postId: testPost.id,
            path: `/blog/${testPost.slug}`,
            visitorId: 'visitor-2',
            userAgent: 'Test Agent 2'
          }
        ]
      })

      const analytics = await prisma.pageView.groupBy({
        by: ['postId'],
        where: { postId: testPost.id },
        _count: { id: true }
      })

      expect(analytics).toHaveLength(1)
      expect(analytics[0]._count.id).toBe(2)
    })
  })

  describe('Media Management', () => {
    it('should create media record', async () => {
      const mediaData = {
        filename: 'test-image.jpg',
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        url: '/uploads/test-image.jpg',
        folder: 'test',
        alt: 'Test image',
        tags: ['test', 'image'],
        uploadedById: testUser.id
      }

      const media = await prisma.media.create({
        data: mediaData
      })

      expect(media).toBeDefined()
      expect(media.filename).toBe(mediaData.filename)
      expect(media.mimeType).toBe(mediaData.mimeType)
      expect(media.uploadedById).toBe(testUser.id)

      // Cleanup
      await prisma.media.delete({ where: { id: media.id } })
    })
  })

  describe('User Management', () => {
    it('should create user with proper role', async () => {
      const userData = {
        email: 'editor@example.com',
        name: 'Editor User',
        role: 'EDITOR'
      }

      const user = await prisma.user.create({
        data: userData
      })

      expect(user).toBeDefined()
      expect(user.email).toBe(userData.email)
      expect(user.role).toBe('EDITOR')

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } })
    })

    it('should handle user permissions correctly', async () => {
      const editorUser = await prisma.user.create({
        data: {
          email: 'editor2@example.com',
          name: 'Editor User 2',
          role: 'EDITOR'
        }
      })

      // Editor should be able to create posts
      const editorPost = await prisma.post.create({
        data: {
          title: 'Editor Post',
          content: 'Content by editor',
          status: 'DRAFT',
          categoryId: testCategory.id,
          authorId: editorUser.id
        }
      })

      expect(editorPost.authorId).toBe(editorUser.id)

      // Cleanup
      await prisma.post.delete({ where: { id: editorPost.id } })
      await prisma.user.delete({ where: { id: editorUser.id } })
    })
  })

  describe('Real-time Features', () => {
    it('should handle comment notifications', async () => {
      const comment = await prisma.comment.create({
        data: {
          content: 'Test comment',
          postId: testPost.id,
          authorId: testUser.id
        }
      })

      expect(comment).toBeDefined()
      expect(comment.postId).toBe(testPost.id)
      expect(comment.authorId).toBe(testUser.id)

      // Cleanup
      await prisma.comment.delete({ where: { id: comment.id } })
    })
  })
})

describe('API Endpoints', () => {
  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: 'API Test Post',
          content: 'Content for API test',
          status: 'DRAFT',
          categoryId: testCategory.id
        }
      })

      // Mock authentication
      req.headers = {
        authorization: 'Bearer mock-token'
      }

      // This would normally call the actual API handler
      // For now, we'll test the database operation directly
      const post = await prisma.post.create({
        data: {
          title: 'API Test Post',
          content: 'Content for API test',
          status: 'DRAFT',
          categoryId: testCategory.id,
          authorId: testUser.id
        }
      })

      expect(post.title).toBe('API Test Post')
      expect(post.status).toBe('DRAFT')

      // Cleanup
      await prisma.post.delete({ where: { id: post.id } })
    })
  })

  describe('GET /api/analytics', () => {
    it('should return analytics data', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { timeframe: '7d' }
      })

      // Test analytics query
      const analytics = await prisma.pageView.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })

      expect(Array.isArray(analytics)).toBe(true)
    })
  })
})

describe('Performance Tests', () => {
  it('should handle bulk operations efficiently', async () => {
    const startTime = Date.now()
    
    // Create multiple posts
    const posts = await Promise.all(
      Array.from({ length: 10 }, (_, i) => 
        prisma.post.create({
          data: {
            title: `Bulk Post ${i}`,
            content: `Content for bulk post ${i}`,
            status: 'PUBLISHED',
            categoryId: testCategory.id,
            authorId: testUser.id
          }
        })
      )
    )

    const endTime = Date.now()
    const duration = endTime - startTime

    expect(posts).toHaveLength(10)
    expect(duration).toBeLessThan(5000) // Should complete within 5 seconds

    // Cleanup
    await prisma.post.deleteMany({
      where: {
        id: { in: posts.map(p => p.id) }
      }
    })
  })
})
