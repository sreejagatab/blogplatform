import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { platformManager } from '@/lib/platforms/platform-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/platforms - Get all available platforms
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const feature = searchParams.get('feature');
    
    let platforms;
    
    if (category) {
      platforms = platformManager.getPlatformsByCategory(category);
    } else {
      platforms = platformManager.getAllAdapters();
    }
    
    // Filter by feature if specified
    if (feature) {
      platforms = platforms.filter(adapter => {
        const capabilities = adapter.getCapabilities();
        switch (feature) {
          case 'scheduling':
            return capabilities.supportsScheduling;
          case 'images':
            return capabilities.supportsImages;
          case 'videos':
            return capabilities.supportsVideo;
          case 'hashtags':
            return capabilities.supportsHashtags;
          default:
            return true;
        }
      });
    }
    
    const platformInfo = platforms.map(adapter => ({
      name: adapter.platform,
      displayName: adapter.displayName,
      category: adapter.category,
      capabilities: adapter.getCapabilities()
    }));
    
    return NextResponse.json({
      platforms: platformInfo,
      statistics: platformManager.getStatistics()
    });
    
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}
