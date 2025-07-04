import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics-service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const activity = await analyticsService.getRealTimeActivity(limit)

    return NextResponse.json({
      success: true,
      data: activity
    })
  } catch (error) {
    console.error('Real-time analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch real-time activity' 
      },
      { status: 500 }
    )
  }
}
