/**
 * Email and Notification Service
 * Handles email campaigns, newsletters, and user notifications
 */

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  category: 'newsletter' | 'notification' | 'marketing' | 'transactional'
  createdAt: Date
  updatedAt: Date
}

export interface EmailCampaign {
  id: string
  name: string
  templateId: string
  subject: string
  recipients: EmailRecipient[]
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
  scheduledAt?: Date
  sentAt?: Date
  stats: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
  }
  settings: {
    trackOpens: boolean
    trackClicks: boolean
    allowUnsubscribe: boolean
  }
}

export interface EmailRecipient {
  email: string
  name?: string
  tags: string[]
  subscribed: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  lastEmailSent?: Date
  engagement: {
    opens: number
    clicks: number
    lastOpened?: Date
    lastClicked?: Date
  }
}

export interface Newsletter {
  id: string
  title: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  nextSendDate: Date
  subscribers: number
  template: string
  active: boolean
  autoContent: {
    enabled: boolean
    sources: string[]
    filters: string[]
  }
}

export interface NotificationSettings {
  email: {
    newComment: boolean
    newFollower: boolean
    postPublished: boolean
    weeklyDigest: boolean
    marketingEmails: boolean
  }
  push: {
    newComment: boolean
    newFollower: boolean
    postPublished: boolean
  }
  inApp: {
    newComment: boolean
    newFollower: boolean
    postPublished: boolean
    systemUpdates: boolean
  }
}

export interface EmailAnalytics {
  totalSent: number
  deliveryRate: number
  openRate: number
  clickRate: number
  unsubscribeRate: number
  bounceRate: number
  recentCampaigns: Array<{
    id: string
    name: string
    sentAt: Date
    recipients: number
    openRate: number
    clickRate: number
  }>
  topPerformingEmails: Array<{
    id: string
    subject: string
    openRate: number
    clickRate: number
  }>
  audienceGrowth: Array<{
    date: Date
    subscribers: number
    unsubscribes: number
  }>
}

class EmailService {
  private templates: EmailTemplate[] = []
  private campaigns: EmailCampaign[] = []
  private recipients: EmailRecipient[] = []
  private newsletters: Newsletter[] = []

  constructor() {
    this.initializeMockData()
  }

  /**
   * Send a single email
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    content: { html: string; text: string },
    options?: {
      from?: string
      replyTo?: string
      attachments?: Array<{ filename: string; content: Buffer }>
      trackOpens?: boolean
      trackClicks?: boolean
    }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('Email sent:', {
        to,
        subject,
        messageId,
        options
      })

      return {
        success: true,
        messageId
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create email template
   */
  async createTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.templates.push(newTemplate)
    return newTemplate
  }

  /**
   * Get all email templates
   */
  async getTemplates(category?: string): Promise<EmailTemplate[]> {
    if (category) {
      return this.templates.filter(t => t.category === category)
    }
    return this.templates
  }

  /**
   * Create email campaign
   */
  async createCampaign(campaign: Omit<EmailCampaign, 'id' | 'stats'>): Promise<EmailCampaign> {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: this.generateId(),
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      }
    }

    this.campaigns.push(newCampaign)
    return newCampaign
  }

  /**
   * Send campaign
   */
  async sendCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    const campaign = this.campaigns.find(c => c.id === campaignId)
    if (!campaign) {
      return { success: false, error: 'Campaign not found' }
    }

    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return { success: false, error: 'Campaign cannot be sent in current status' }
    }

    try {
      // Update campaign status
      campaign.status = 'sending'
      
      // Simulate sending to all recipients
      for (const recipient of campaign.recipients) {
        if (recipient.subscribed) {
          await this.sendEmail(
            recipient.email,
            campaign.subject,
            { html: '<p>Campaign content</p>', text: 'Campaign content' },
            {
              trackOpens: campaign.settings.trackOpens,
              trackClicks: campaign.settings.trackClicks
            }
          )
          
          campaign.stats.sent++
          campaign.stats.delivered++ // Assume all are delivered for mock
        }
      }

      // Update campaign status
      campaign.status = 'sent'
      campaign.sentAt = new Date()

      return { success: true }
    } catch (error) {
      campaign.status = 'draft'
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Manage newsletter subscribers
   */
  async subscribeToNewsletter(email: string, name?: string, tags: string[] = []): Promise<{ success: boolean; error?: string }> {
    const existingRecipient = this.recipients.find(r => r.email === email)
    
    if (existingRecipient) {
      if (existingRecipient.subscribed) {
        return { success: false, error: 'Already subscribed' }
      }
      
      existingRecipient.subscribed = true
      existingRecipient.subscribedAt = new Date()
      existingRecipient.unsubscribedAt = undefined
      existingRecipient.tags = [...new Set([...existingRecipient.tags, ...tags])]
    } else {
      const newRecipient: EmailRecipient = {
        email,
        name,
        tags,
        subscribed: true,
        subscribedAt: new Date(),
        engagement: {
          opens: 0,
          clicks: 0
        }
      }
      
      this.recipients.push(newRecipient)
    }

    // Send welcome email
    await this.sendEmail(
      email,
      'Welcome to our newsletter!',
      {
        html: '<h1>Welcome!</h1><p>Thank you for subscribing to our newsletter.</p>',
        text: 'Welcome! Thank you for subscribing to our newsletter.'
      }
    )

    return { success: true }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribeFromNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
    const recipient = this.recipients.find(r => r.email === email)
    
    if (!recipient) {
      return { success: false, error: 'Email not found' }
    }

    if (!recipient.subscribed) {
      return { success: false, error: 'Already unsubscribed' }
    }

    recipient.subscribed = false
    recipient.unsubscribedAt = new Date()

    return { success: true }
  }

  /**
   * Get newsletter subscribers
   */
  async getSubscribers(filters?: {
    subscribed?: boolean
    tags?: string[]
    lastEmailSent?: { before?: Date; after?: Date }
  }): Promise<EmailRecipient[]> {
    let filtered = this.recipients

    if (filters) {
      if (filters.subscribed !== undefined) {
        filtered = filtered.filter(r => r.subscribed === filters.subscribed)
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(r => 
          filters.tags!.some(tag => r.tags.includes(tag))
        )
      }
      
      if (filters.lastEmailSent) {
        filtered = filtered.filter(r => {
          if (!r.lastEmailSent) return false
          
          if (filters.lastEmailSent!.before && r.lastEmailSent > filters.lastEmailSent!.before) {
            return false
          }
          
          if (filters.lastEmailSent!.after && r.lastEmailSent < filters.lastEmailSent!.after) {
            return false
          }
          
          return true
        })
      }
    }

    return filtered
  }

  /**
   * Get email analytics
   */
  async getAnalytics(dateRange?: { start: Date; end: Date }): Promise<EmailAnalytics> {
    // Mock analytics data
    return {
      totalSent: 15420,
      deliveryRate: 98.5,
      openRate: 24.3,
      clickRate: 3.8,
      unsubscribeRate: 0.2,
      bounceRate: 1.5,
      recentCampaigns: [
        {
          id: '1',
          name: 'Weekly Newsletter #45',
          sentAt: new Date('2024-01-15'),
          recipients: 1250,
          openRate: 28.5,
          clickRate: 4.2
        },
        {
          id: '2',
          name: 'Product Update Announcement',
          sentAt: new Date('2024-01-12'),
          recipients: 890,
          openRate: 35.1,
          clickRate: 6.8
        }
      ],
      topPerformingEmails: [
        {
          id: '1',
          subject: '5 Web Development Trends You Can\'t Ignore',
          openRate: 42.3,
          clickRate: 8.9
        },
        {
          id: '2',
          subject: 'Free React Course - Limited Time',
          openRate: 38.7,
          clickRate: 7.2
        }
      ],
      audienceGrowth: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        subscribers: Math.floor(Math.random() * 50) + 20,
        unsubscribes: Math.floor(Math.random() * 5)
      })).reverse()
    }
  }

  /**
   * Create automated newsletter
   */
  async createNewsletter(newsletter: Omit<Newsletter, 'id' | 'subscribers'>): Promise<Newsletter> {
    const newNewsletter: Newsletter = {
      ...newsletter,
      id: this.generateId(),
      subscribers: this.recipients.filter(r => r.subscribed).length
    }

    this.newsletters.push(newNewsletter)
    return newNewsletter
  }

  /**
   * Send newsletter
   */
  async sendNewsletter(newsletterId: string): Promise<{ success: boolean; error?: string }> {
    const newsletter = this.newsletters.find(n => n.id === newsletterId)
    if (!newsletter) {
      return { success: false, error: 'Newsletter not found' }
    }

    const subscribers = await this.getSubscribers({ subscribed: true })
    
    // Create campaign for newsletter
    const campaign = await this.createCampaign({
      name: `${newsletter.title} - ${new Date().toLocaleDateString()}`,
      templateId: newsletter.template,
      subject: newsletter.title,
      recipients: subscribers,
      status: 'draft',
      settings: {
        trackOpens: true,
        trackClicks: true,
        allowUnsubscribe: true
      }
    })

    // Send the campaign
    return await this.sendCampaign(campaign.id)
  }

  /**
   * Track email events
   */
  async trackEmailEvent(
    type: 'open' | 'click' | 'bounce' | 'unsubscribe',
    email: string,
    campaignId?: string
  ): Promise<void> {
    const recipient = this.recipients.find(r => r.email === email)
    if (!recipient) return

    const campaign = campaignId ? this.campaigns.find(c => c.id === campaignId) : null

    switch (type) {
      case 'open':
        recipient.engagement.opens++
        recipient.engagement.lastOpened = new Date()
        if (campaign) campaign.stats.opened++
        break
      
      case 'click':
        recipient.engagement.clicks++
        recipient.engagement.lastClicked = new Date()
        if (campaign) campaign.stats.clicked++
        break
      
      case 'bounce':
        if (campaign) campaign.stats.bounced++
        break
      
      case 'unsubscribe':
        recipient.subscribed = false
        recipient.unsubscribedAt = new Date()
        if (campaign) campaign.stats.unsubscribed++
        break
    }
  }

  private initializeMockData() {
    // Mock email templates
    this.templates = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to our platform!',
        htmlContent: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
        textContent: 'Welcome! Thank you for joining us.',
        variables: ['name', 'email'],
        category: 'transactional',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Weekly Newsletter',
        subject: 'Your weekly dose of web development',
        htmlContent: '<h1>This Week in Web Dev</h1><p>Latest articles and tutorials...</p>',
        textContent: 'This Week in Web Dev - Latest articles and tutorials...',
        variables: ['name', 'articles'],
        category: 'newsletter',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ]

    // Mock recipients
    this.recipients = [
      {
        email: 'user1@example.com',
        name: 'John Doe',
        tags: ['developer', 'javascript'],
        subscribed: true,
        subscribedAt: new Date('2024-01-01'),
        engagement: { opens: 15, clicks: 3, lastOpened: new Date('2024-01-14') }
      },
      {
        email: 'user2@example.com',
        name: 'Jane Smith',
        tags: ['designer', 'css'],
        subscribed: true,
        subscribedAt: new Date('2024-01-05'),
        engagement: { opens: 8, clicks: 2, lastOpened: new Date('2024-01-13') }
      }
    ]

    // Mock newsletters
    this.newsletters = [
      {
        id: '1',
        title: 'Weekly Web Dev Digest',
        description: 'Latest web development articles and tutorials',
        frequency: 'weekly',
        nextSendDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subscribers: this.recipients.filter(r => r.subscribed).length,
        template: '2',
        active: true,
        autoContent: {
          enabled: true,
          sources: ['blog', 'external'],
          filters: ['web development', 'javascript', 'react']
        }
      }
    ]
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Utility functions
export const sendWelcomeEmail = async (email: string, name: string) => {
  return await emailService.sendEmail(
    email,
    'Welcome to Universal Blog Platform!',
    {
      html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining our platform.</p>`,
      text: `Welcome, ${name}! Thank you for joining our platform.`
    }
  )
}

export const sendNotificationEmail = async (
  email: string,
  type: 'comment' | 'follower' | 'published',
  data: any
) => {
  const subjects = {
    comment: 'New comment on your post',
    follower: 'You have a new follower',
    published: 'Your post has been published'
  }

  const content = {
    comment: `<p>Someone commented on your post "${data.postTitle}"</p>`,
    follower: `<p>${data.followerName} started following you</p>`,
    published: `<p>Your post "${data.postTitle}" has been published successfully</p>`
  }

  return await emailService.sendEmail(
    email,
    subjects[type],
    {
      html: content[type],
      text: content[type].replace(/<[^>]*>/g, '')
    }
  )
}
