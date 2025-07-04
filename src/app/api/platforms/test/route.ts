import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { platformTester, runPlatformTests, testPlatform, checkPlatformHealth } from '@/lib/platforms/integration-test'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('type') || 'all'
    const platform = searchParams.get('platform')

    let results

    switch (testType) {
      case 'all':
        results = await runPlatformTests()
        break
      
      case 'platform':
        if (!platform) {
          return NextResponse.json({ error: 'Platform parameter required for platform test' }, { status: 400 })
        }
        results = await testPlatform(platform)
        break
      
      case 'health':
        results = await checkPlatformHealth()
        break
      
      default:
        return NextResponse.json({ error: 'Invalid test type. Use: all, platform, or health' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      testType,
      platform: platform || null,
      timestamp: new Date().toISOString(),
      results
    })

  } catch (error) {
    console.error('Platform test error:', error)
    return NextResponse.json(
      { error: 'Failed to run platform tests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, platforms } = body

    if (action === 'test-multiple' && platforms && Array.isArray(platforms)) {
      const results = []
      
      for (const platform of platforms) {
        try {
          const result = await testPlatform(platform)
          results.push(result)
        } catch (error) {
          results.push({
            platform,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      return NextResponse.json({
        success: true,
        action,
        platforms,
        timestamp: new Date().toISOString(),
        results
      })
    }

    return NextResponse.json({ error: 'Invalid action or parameters' }, { status: 400 })

  } catch (error) {
    console.error('Platform test POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process platform test request' },
      { status: 500 }
    )
  }
}
