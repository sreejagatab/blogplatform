/**
 * AI Content Analysis API Endpoint
 * Provides comprehensive content analysis using AI services
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
    const { content, provider } = body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty' },
        { status: 400 }
      );
    }

    // Get AI content manager
    const aiManager = getAIContentManager();

    // Analyze content
    const analysis = await aiManager.analyzeContent(content, provider);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Content analysis error:', error);

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

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get AI content manager
    const aiManager = getAIContentManager();

    // Get available providers and their status
    const providers = aiManager.getAvailableProviders();
    const providerStatus = providers.reduce((acc, provider) => {
      acc[provider] = aiManager.getProviderStatus(provider);
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: {
        availableProviders: providers,
        providerStatus,
        features: {
          contentAnalysis: true,
          seoOptimization: true,
          platformAdaptation: true,
          writingAssistance: true,
          imageAnalysis: true,
          translation: true,
          trendAnalysis: true,
        },
      },
    });
  } catch (error) {
    console.error('AI service status error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
