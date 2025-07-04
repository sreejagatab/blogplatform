import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { platformManager } from '@/lib/platforms/platform-manager'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')

    if (platform) {
      // Get status for specific platform
      const adapter = platformManager.getAdapter(platform)
      if (!adapter) {
        return NextResponse.json(
          { error: 'Platform not found' },
          { status: 404 }
        )
      }

      const status = await adapter.getStatus()
      const capabilities = adapter.getCapabilities()
      const rateLimits = adapter.getRateLimits()

      return NextResponse.json({
        platform,
        status,
        capabilities,
        rateLimits,
        lastChecked: new Date().toISOString()
      })
    } else {
      // Get status for all platforms
      const adapters = platformManager.getAllAdapters()
      const statuses = await Promise.all(
        adapters.map(async (adapter) => {
          try {
            const status = await adapter.getStatus()
            const capabilities = adapter.getCapabilities()
            const rateLimits = adapter.getRateLimits()

            return {
              platform: adapter.platform,
              displayName: adapter.displayName,
              category: adapter.category,
              status,
              capabilities,
              rateLimits,
              lastChecked: new Date().toISOString()
            }
          } catch (error) {
            return {
              platform: adapter.platform,
              displayName: adapter.displayName,
              category: adapter.category,
              status: {
                connected: false,
                healthy: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              },
              capabilities: adapter.getCapabilities(),
              rateLimits: adapter.getRateLimits(),
              lastChecked: new Date().toISOString()
            }
          }
        })
      )

      // Group by category
      const groupedStatuses = statuses.reduce((acc, status) => {
        const category = status.category || 'other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(status)
        return acc
      }, {} as Record<string, any[]>)

      // Calculate overall health
      const totalPlatforms = statuses.length
      const healthyPlatforms = statuses.filter(s => s.status.healthy).length
      const connectedPlatforms = statuses.filter(s => s.status.connected).length

      return NextResponse.json({
        summary: {
          total: totalPlatforms,
          healthy: healthyPlatforms,
          connected: connectedPlatforms,
          healthPercentage: totalPlatforms > 0 ? Math.round((healthyPlatforms / totalPlatforms) * 100) : 0
        },
        platforms: groupedStatuses,
        lastUpdated: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error fetching platform status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { platform, action } = body

    if (!platform || !action) {
      return NextResponse.json(
        { error: 'Platform and action are required' },
        { status: 400 }
      )
    }

    const adapter = platformManager.getAdapter(platform)
    if (!adapter) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      )
    }

    let result
    
    switch (action) {
      case 'test':
        result = await adapter.testConnection()
        break
        
      case 'refresh':
        result = await adapter.refreshTokens()
        break
        
      case 'reset':
        result = await adapter.resetConnection()
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      platform,
      action,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error performing platform action:', error)
    return NextResponse.json(
      { error: 'Failed to perform platform action' },
      { status: 500 }
    )
  }
}
