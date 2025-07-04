import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  sourcePlatforms: z.array(z.string()).min(1, 'At least one source platform is required'),
  targetPlatforms: z.array(z.string()).min(1, 'At least one target platform is required'),
  contentFilters: z.object({
    keywords: z.array(z.string()).optional(),
    excludeKeywords: z.array(z.string()).optional(),
    minWordCount: z.number().optional(),
    maxWordCount: z.number().optional(),
    requiredTags: z.array(z.string()).optional(),
    excludeTags: z.array(z.string()).optional(),
    sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
    languages: z.array(z.string()).optional()
  }).optional(),
  transformRules: z.object({
    addPrefix: z.string().optional(),
    addSuffix: z.string().optional(),
    removeHashtags: z.boolean().optional(),
    addHashtags: z.array(z.string()).optional(),
    shortenContent: z.boolean().optional(),
    maxLength: z.number().optional()
  }).optional(),
  schedule: z.object({
    immediate: z.boolean().optional(),
    delay: z.number().optional(), // minutes
    timeZone: z.string().optional(),
    allowedHours: z.array(z.number()).optional(), // 0-23
    allowedDays: z.array(z.number()).optional() // 0-6 (Sunday-Saturday)
  }).optional(),
  enabled: z.boolean().default(true)
})

const updateRuleSchema = z.object({
  ruleId: z.string(),
  name: z.string().optional(),
  sourcePlatforms: z.array(z.string()).optional(),
  targetPlatforms: z.array(z.string()).optional(),
  contentFilters: z.object({
    keywords: z.array(z.string()).optional(),
    excludeKeywords: z.array(z.string()).optional(),
    minWordCount: z.number().optional(),
    maxWordCount: z.number().optional(),
    requiredTags: z.array(z.string()).optional(),
    excludeTags: z.array(z.string()).optional(),
    sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
    languages: z.array(z.string()).optional()
  }).optional(),
  transformRules: z.object({
    addPrefix: z.string().optional(),
    addSuffix: z.string().optional(),
    removeHashtags: z.boolean().optional(),
    addHashtags: z.array(z.string()).optional(),
    shortenContent: z.boolean().optional(),
    maxLength: z.number().optional()
  }).optional(),
  schedule: z.object({
    immediate: z.boolean().optional(),
    delay: z.number().optional(),
    timeZone: z.string().optional(),
    allowedHours: z.array(z.number()).optional(),
    allowedDays: z.array(z.number()).optional()
  }).optional(),
  enabled: z.boolean().optional()
})

// GET /api/cross-posting-rules - Get user's cross-posting rules
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rules = await prisma.crossPostingRule.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        enabled: true,
        sourcePlatforms: true,
        targetPlatforms: true,
        contentFilters: true,
        transformRules: true,
        schedule: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            user: {
              where: {
                crossPosts: {
                  some: {
                    inboundContent: {
                      userId: session.user.id
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ rules })
  } catch (error) {
    console.error('Failed to fetch cross-posting rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cross-posting rules' },
      { status: 500 }
    )
  }
}

// POST /api/cross-posting-rules - Create new cross-posting rule
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createRuleSchema.parse(body)

    // Check for duplicate rule names
    const existingRule = await prisma.crossPostingRule.findFirst({
      where: {
        userId: session.user.id,
        name: validatedData.name
      }
    })

    if (existingRule) {
      return NextResponse.json(
        { error: 'A rule with this name already exists' },
        { status: 409 }
      )
    }

    // Create the rule
    const rule = await prisma.crossPostingRule.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        enabled: validatedData.enabled,
        sourcePlatforms: validatedData.sourcePlatforms,
        targetPlatforms: validatedData.targetPlatforms,
        contentFilters: validatedData.contentFilters || {},
        transformRules: validatedData.transformRules || {},
        schedule: validatedData.schedule || {}
      }
    })

    return NextResponse.json({
      success: true,
      rule,
      message: 'Cross-posting rule created successfully'
    })
  } catch (error) {
    console.error('Failed to create cross-posting rule:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create cross-posting rule' },
      { status: 500 }
    )
  }
}

// PUT /api/cross-posting-rules - Update cross-posting rule
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateRuleSchema.parse(body)

    // Verify user owns this rule
    const existingRule = await prisma.crossPostingRule.findFirst({
      where: {
        id: validatedData.ruleId,
        userId: session.user.id
      }
    })

    if (!existingRule) {
      return NextResponse.json(
        { error: 'Cross-posting rule not found' },
        { status: 404 }
      )
    }

    // Check for duplicate names if name is being updated
    if (validatedData.name && validatedData.name !== existingRule.name) {
      const duplicateRule = await prisma.crossPostingRule.findFirst({
        where: {
          userId: session.user.id,
          name: validatedData.name,
          id: { not: validatedData.ruleId }
        }
      })

      if (duplicateRule) {
        return NextResponse.json(
          { error: 'A rule with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update the rule
    const updatedRule = await prisma.crossPostingRule.update({
      where: { id: validatedData.ruleId },
      data: {
        name: validatedData.name,
        enabled: validatedData.enabled,
        sourcePlatforms: validatedData.sourcePlatforms,
        targetPlatforms: validatedData.targetPlatforms,
        contentFilters: validatedData.contentFilters,
        transformRules: validatedData.transformRules,
        schedule: validatedData.schedule,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      rule: updatedRule,
      message: 'Cross-posting rule updated successfully'
    })
  } catch (error) {
    console.error('Failed to update cross-posting rule:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update cross-posting rule' },
      { status: 500 }
    )
  }
}

// DELETE /api/cross-posting-rules - Delete cross-posting rule
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ruleId = searchParams.get('ruleId')

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required' },
        { status: 400 }
      )
    }

    // Verify user owns this rule
    const existingRule = await prisma.crossPostingRule.findFirst({
      where: {
        id: ruleId,
        userId: session.user.id
      }
    })

    if (!existingRule) {
      return NextResponse.json(
        { error: 'Cross-posting rule not found' },
        { status: 404 }
      )
    }

    // Delete the rule
    await prisma.crossPostingRule.delete({
      where: { id: ruleId }
    })

    return NextResponse.json({
      success: true,
      message: 'Cross-posting rule deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete cross-posting rule:', error)
    return NextResponse.json(
      { error: 'Failed to delete cross-posting rule' },
      { status: 500 }
    )
  }
}
