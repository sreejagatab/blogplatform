/**
 * Analytics API Endpoints
 * Provides comprehensive analytics data for the dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
    const platforms = searchParams.get('platforms')?.split(',') || [];
    const categories = searchParams.get('categories')?.split(',') || [];

    const query = {
      startDate,
      endDate,
      platforms,
      categories,
    };

    // Get analytics service
    const analyticsService = getAnalyticsService();

    // Get overview data
    const overview = await analyticsService.getOverview(query);

    return NextResponse.json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics overview' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { reportConfig } = body;

    // Get analytics service
    const analyticsService = getAnalyticsService();

    // Generate report
    const report = await analyticsService.generateReport(reportConfig);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Analytics report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics report' },
      { status: 500 }
    );
  }
}
