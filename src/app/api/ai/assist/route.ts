/**
 * AI Writing Assistant API Endpoint
 * Provides AI-powered writing assistance and suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAIContentManager } from '@/lib/ai/ai-content-manager';
import { AIServiceError } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const {
      type,
      content,
      context,
      tone,
      targetLength,
      targetAudience,
      provider
    } = body;

    // Validate input
    if (!type || !content) {
      return NextResponse.json(
        { error: 'type and content are required' },
        { status: 400 }
      );
    }

    const validTypes = ['continue', 'rewrite', 'summarize', 'expand', 'simplify'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Get AI content manager
    const aiManager = getAIContentManager();

    // Get writing assistance
    const assistance = await aiManager.getWritingAssistance({
      type,
      content,
      context,
      tone,
      targetLength,
      targetAudience,
    }, provider);

    return NextResponse.json({
      success: true,
      data: assistance,
    });
  } catch (error) {
    console.error('Writing assistance error:', error);

    if (error instanceof AIServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          provider: error.provider,
        },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
