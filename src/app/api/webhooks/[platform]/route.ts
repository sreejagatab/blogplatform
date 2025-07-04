import { NextRequest, NextResponse } from 'next/server'
import { webhookProcessor } from '@/lib/inbound/webhook-processor'
import crypto from 'crypto'
import { headers } from 'next/headers'

// Supported platforms for webhook processing
const SUPPORTED_PLATFORMS = [
  'twitter',
  'linkedin', 
  'medium',
  'devto',
  'hashnode',
  'github',
  'youtube',
  'facebook',
  'instagram',
  'discord',
  'reddit',
  'pinterest',
  'tiktok',
  'mastodon',
  'threads'
]

export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toLowerCase()

  try {
    // Validate platform
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      )
    }

    // Log incoming webhook for debugging
    console.log(`Received webhook for platform: ${platform}`)
    
    // Get request headers for signature verification
    const headersList = headers()
    const signature = headersList.get('x-hub-signature-256') || 
                     headersList.get('x-signature') ||
                     headersList.get('signature')
    
    const userAgent = headersList.get('user-agent')
    const contentType = headersList.get('content-type')

    console.log(`Webhook headers - Signature: ${signature}, User-Agent: ${userAgent}, Content-Type: ${contentType}`)

    // Process the webhook
    const result = await webhookProcessor.processWebhook(request, platform)

    if (result.success) {
      console.log(`Webhook processed successfully for ${platform}`, {
        contentId: result.contentId
      })
      
      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
        contentId: result.contentId
      })
    } else {
      console.error(`Webhook processing failed for ${platform}:`, result.error)
      
      // Return appropriate status code based on error type
      const statusCode = result.shouldRetry ? 500 : 400
      
      return NextResponse.json(
        { 
          error: result.error || 'Webhook processing failed',
          shouldRetry: result.shouldRetry 
        },
        { status: statusCode }
      )
    }
  } catch (error) {
    console.error(`Webhook endpoint error for ${platform}:`, error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification (required by some platforms)
export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toLowerCase()
  const { searchParams } = new URL(request.url)

  try {
    // Platform-specific webhook verification
    switch (platform) {
      case 'facebook':
      case 'instagram':
        // Facebook/Instagram webhook verification
        const mode = searchParams.get('hub.mode')
        const token = searchParams.get('hub.verify_token')
        const challenge = searchParams.get('hub.challenge')

        if (mode === 'subscribe' && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
          console.log('Facebook webhook verified')
          return new NextResponse(challenge)
        } else {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

      case 'twitter':
        // Twitter webhook verification (CRC)
        const crc_token = searchParams.get('crc_token')
        if (crc_token) {

          const hmac = crypto.createHmac('sha256', process.env.TWITTER_WEBHOOK_SECRET || '')
          hmac.update(crc_token)
          const responseToken = 'sha256=' + hmac.digest('base64')
          
          return NextResponse.json({ response_token: responseToken })
        }
        break

      case 'github':
        // GitHub webhook verification (ping event)
        return NextResponse.json({ message: 'GitHub webhook endpoint ready' })

      case 'discord':
        // Discord webhook verification
        return NextResponse.json({ message: 'Discord webhook endpoint ready' })

      default:
        // Generic webhook verification
        const verify_token = searchParams.get('verify_token') || searchParams.get('token')
        const expected_token = process.env[`${platform.toUpperCase()}_WEBHOOK_VERIFY_TOKEN`]
        
        if (verify_token && verify_token === expected_token) {
          return NextResponse.json({ verified: true })
        }
    }

    return NextResponse.json(
      { message: `${platform} webhook endpoint ready` },
      { status: 200 }
    )
  } catch (error) {
    console.error(`Webhook verification error for ${platform}:`, error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

// Handle HEAD requests (health checks)
export async function HEAD(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const platform = params.platform.toLowerCase()
  
  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return new NextResponse(null, { status: 404 })
  }
  
  return new NextResponse(null, { status: 200 })
}

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Hub-Signature-256, X-Signature',
    },
  })
}
