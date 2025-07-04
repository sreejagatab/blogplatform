import { NextRequest, NextResponse } from 'next/server'
import { analyticsService } from '@/lib/analytics-service'

export async function GET(request: NextRequest) {
  try {
    const comparison = await analyticsService.getPlatformComparison()

    return NextResponse.json({
      success: true,
      data: comparison
    })
  } catch (error) {
    console.error('Platform analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch platform comparison' 
      },
      { status: 500 }
    )
  }
}
