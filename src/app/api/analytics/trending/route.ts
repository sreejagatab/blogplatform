import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics-service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') as 'hour' | 'day' | 'week' || 'day'

    const trending = await analyticsService.getTrendingContent(timeframe)

    return NextResponse.json({
      success: true,
      data: trending
    })
  } catch (error) {
    console.error('Trending analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch trending content' 
      },
      { status: 500 }
    )
  }
}
