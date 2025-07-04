import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { platformManager } from '@/lib/platforms/platform-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/platforms/health - Check health status of all platforms
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const platformsParam = searchParams.get('platforms');
    
    let platforms: string[] | undefined;
    if (platformsParam) {
      platforms = platformsParam.split(',');
    }
    
    const healthStatus = await platformManager.batchHealthCheck(platforms);
    
    // Calculate overall health statistics
    const totalPlatforms = Object.keys(healthStatus).length;
    const onlinePlatforms = Object.values(healthStatus).filter(status => status.isOnline).length;
    const offlinePlatforms = totalPlatforms - onlinePlatforms;
    
    // Calculate average response time
    const responseTimes = Object.values(healthStatus)
      .map(status => status.responseTime)
      .filter(time => time !== undefined) as number[];
    
    const averageResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary: {
        totalPlatforms,
        onlinePlatforms,
        offlinePlatforms,
        healthPercentage: Math.round((onlinePlatforms / totalPlatforms) * 100),
        averageResponseTime
      },
      platforms: healthStatus
    });
    
  } catch (error) {
    console.error('Error checking platform health:', error);
    return NextResponse.json(
      { error: 'Failed to check platform health' },
      { status: 500 }
    );
  }
}
