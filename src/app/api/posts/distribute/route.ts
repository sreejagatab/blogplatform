import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { distributionEngine } from '@/lib/platforms/distribution-engine';
import { z } from 'zod';

const distributePostSchema = z.object({
  postId: z.string(),
  platforms: z.array(z.string()),
  scheduledFor: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

// POST /api/posts/distribute - Distribute a post to multiple platforms
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validation = distributePostSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { postId, platforms, scheduledFor } = validation.data;
    
    // Create distribution job
    const job = await distributionEngine.distributePost(postId, platforms, scheduledFor);
    
    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        postId: job.postId,
        platforms: job.platforms,
        status: job.status,
        scheduledFor: job.scheduledFor,
        createdAt: job.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error distributing post:', error);
    return NextResponse.json(
      { error: 'Failed to distribute post' },
      { status: 500 }
    );
  }
}

// GET /api/posts/distribute/[jobId] - Get distribution job status
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { jobId } = params;
    
    const job = await distributionEngine.getJobStatus(jobId);
    
    return NextResponse.json({
      job: {
        id: job.id,
        postId: job.postId,
        platforms: job.platforms,
        status: job.status,
        results: job.results,
        scheduledFor: job.scheduledFor,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      { error: 'Job not found or failed to fetch status' },
      { status: 404 }
    );
  }
}
