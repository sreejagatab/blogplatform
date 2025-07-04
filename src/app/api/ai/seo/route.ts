/**
 * AI SEO Analysis API Endpoint
 * Provides SEO analysis and optimization suggestions using AI
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
    const { title, content, targetKeywords, provider } = body;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get AI content manager
    const aiManager = getAIContentManager();

    // Analyze SEO
    const seoAnalysis = await aiManager.analyzeSEO(title, content, targetKeywords, provider);

    return NextResponse.json({
      success: true,
      data: seoAnalysis,
    });
  } catch (error) {
    console.error('SEO analysis error:', error);

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
