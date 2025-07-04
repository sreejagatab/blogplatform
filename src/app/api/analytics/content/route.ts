/**
 * Content Metrics API Endpoint
 * Provides detailed content performance metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { getAnalyticsService } from '@/lib/analytics/analytics-service';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get('endDate') || new Date().toISOString();
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const platforms = searchParams.get('platforms')?.split(',') || [];
    const categories = searchParams.get('categories')?.split(',') || [];

    const query = {
      startDate,
      endDate,
      limit,
      offset,
      platforms,
      categories,
    };

    // Get analytics service
    const analyticsService = getAnalyticsService();

    // Get content metrics
    const contentMetrics = await analyticsService.getContentMetrics(query);

    return NextResponse.json({
      success: true,
      data: contentMetrics,
    });
  } catch (error) {
    console.error('Content metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to get content metrics' },
      { status: 500 }
    );
  }
}
