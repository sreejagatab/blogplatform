import { NextRequest, NextResponse } from 'next/server'
import { aiContentService } from '@/lib/ai-content-service'

export async function POST(request: NextRequest) {
  try {
    const { content, variationCount = 3 } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const variations = await aiContentService.generateVariations(content, variationCount)

    return NextResponse.json({ variations })
  } catch (error) {
    console.error('Variation generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate variations' },
      { status: 500 }
    )
  }
}
