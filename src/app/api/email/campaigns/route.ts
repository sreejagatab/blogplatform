import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email-service'
import { z } from 'zod'

const createCampaignSchema = z.object({
  name: z.string().min(1),
  templateId: z.string().min(1),
  subject: z.string().min(1),
  recipientFilters: z.object({
    tags: z.array(z.string()).optional(),
    subscribed: z.boolean().default(true),
    lastEmailSent: z.object({
      before: z.string().optional(),
      after: z.string().optional()
    }).optional()
  }).optional(),
  scheduledAt: z.string().optional(),
  settings: z.object({
    trackOpens: z.boolean().default(true),
    trackClicks: z.boolean().default(true),
    allowUnsubscribe: z.boolean().default(true)
  }).default({
    trackOpens: true,
    trackClicks: true,
    allowUnsubscribe: true
  })
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      templateId,
      subject,
      recipientFilters,
      scheduledAt,
      settings
    } = createCampaignSchema.parse(body)

    // Get recipients based on filters
    const recipients = await emailService.getSubscribers(recipientFilters ? {
      subscribed: recipientFilters.subscribed,
      tags: recipientFilters.tags,
      lastEmailSent: recipientFilters.lastEmailSent ? {
        before: recipientFilters.lastEmailSent.before ? new Date(recipientFilters.lastEmailSent.before) : undefined,
        after: recipientFilters.lastEmailSent.after ? new Date(recipientFilters.lastEmailSent.after) : undefined
      } : undefined
    } : { subscribed: true })

    // Create campaign
    const campaign = await emailService.createCampaign({
      name,
      templateId,
      subject,
      recipients,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      settings
    })

    // Save campaign to database
    const dbCampaign = await prisma.emailCampaign.create({
      data: {
        id: campaign.id,
        name: campaign.name,
        templateId: campaign.templateId,
        subject: campaign.subject,
        status: campaign.status,
        scheduledAt: campaign.scheduledAt,
        recipientCount: recipients.length,
        settings: JSON.stringify(campaign.settings),
        createdById: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        status: campaign.status,
        recipientCount: recipients.length,
        scheduledAt: campaign.scheduledAt,
        settings: campaign.settings,
        createdAt: dbCampaign.createdAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get campaigns from database
    const [campaigns, totalCount] = await Promise.all([
      prisma.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }),
      prisma.emailCampaign.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    // Get campaign stats from email service
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        // In a real implementation, you'd get actual stats from the email service
        const mockStats = {
          sent: campaign.status === 'sent' ? campaign.recipientCount : 0,
          delivered: campaign.status === 'sent' ? Math.floor(campaign.recipientCount * 0.98) : 0,
          opened: campaign.status === 'sent' ? Math.floor(campaign.recipientCount * 0.24) : 0,
          clicked: campaign.status === 'sent' ? Math.floor(campaign.recipientCount * 0.04) : 0,
          bounced: campaign.status === 'sent' ? Math.floor(campaign.recipientCount * 0.02) : 0,
          unsubscribed: campaign.status === 'sent' ? Math.floor(campaign.recipientCount * 0.001) : 0
        }

        return {
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          status: campaign.status,
          recipientCount: campaign.recipientCount,
          scheduledAt: campaign.scheduledAt,
          sentAt: campaign.sentAt,
          settings: campaign.settings ? JSON.parse(campaign.settings) : {},
          stats: mockStats,
          createdAt: campaign.createdAt,
          createdBy: campaign.createdBy
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        campaigns: campaignsWithStats,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages
        }
      }
    })
  } catch (error) {
    console.error('Campaign fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !['ADMIN', 'EDITOR'].includes((session.user as any).role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { campaignId, action } = body

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    // Get campaign from database
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    let result
    switch (action) {
      case 'send':
        if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
          return NextResponse.json(
            { error: 'Campaign cannot be sent in current status' },
            { status: 400 }
          )
        }

        // Send campaign using email service
        result = await emailService.sendCampaign(campaignId)
        
        if (result.success) {
          // Update database
          await prisma.emailCampaign.update({
            where: { id: campaignId },
            data: {
              status: 'sent',
              sentAt: new Date()
            }
          })
        }
        break

      case 'pause':
        if (campaign.status !== 'sending') {
          return NextResponse.json(
            { error: 'Campaign is not currently sending' },
            { status: 400 }
          )
        }

        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: { status: 'paused' }
        })

        result = { success: true }
        break

      case 'resume':
        if (campaign.status !== 'paused') {
          return NextResponse.json(
            { error: 'Campaign is not paused' },
            { status: 400 }
          )
        }

        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: { status: 'sending' }
        })

        result = { success: true }
        break

      case 'cancel':
        if (campaign.status === 'sent') {
          return NextResponse.json(
            { error: 'Cannot cancel a sent campaign' },
            { status: 400 }
          )
        }

        await prisma.emailCampaign.update({
          where: { id: campaignId },
          data: { status: 'cancelled' }
        })

        result = { success: true }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.success,
      error: result.error,
      message: `Campaign ${action} ${result.success ? 'successful' : 'failed'}`
    })
  } catch (error) {
    console.error('Campaign action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform campaign action' },
      { status: 500 }
    )
  }
}
