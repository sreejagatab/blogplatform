import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean)
    const postIds = searchParams.get('postIds')?.split(',').filter(Boolean)
    const eventTypes = searchParams.get('eventTypes')?.split(',').filter(Boolean)

    // Build filter
    const filter = {
      dateRange: {
        start: startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: endDate ? new Date(endDate) : new Date()
      },
      platforms,
      postIds,
      eventTypes
    }

    // Get metrics
    const metrics = await analyticsService.getMetrics(filter)

    return NextResponse.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, postId, platform, metadata } = body

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Track the event
    await analyticsService.trackEvent({
      type,
      postId,
      platform,
      sessionId: body.sessionId || 'anonymous',
      metadata: metadata || {},
      location: body.location,
      device: body.device
    })

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track event' 
      },
      { status: 500 }
    )
  }
}
