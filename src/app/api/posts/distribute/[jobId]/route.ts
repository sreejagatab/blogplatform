import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { distributionEngine } from '@/lib/platforms/distribution-engine';

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
    
    const jobId = params.jobId;
    
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

// POST /api/posts/distribute/[jobId]/retry - Retry failed platforms
export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const jobId = params.jobId;
    
    const retryJob = await distributionEngine.retryFailedPlatforms(jobId);
    
    return NextResponse.json({
      success: true,
      retryJob: {
        id: retryJob.id,
        postId: retryJob.postId,
        platforms: retryJob.platforms,
        status: retryJob.status,
        createdAt: retryJob.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error retrying job:', error);
    return NextResponse.json(
      { error: 'Failed to retry job' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/distribute/[jobId] - Cancel distribution job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const jobId = params.jobId;
    
    const cancelled = await distributionEngine.cancelJob(jobId);
    
    if (!cancelled) {
      return NextResponse.json(
        { error: 'Job cannot be cancelled (not found or already processing)' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job cancelled successfully'
    });
    
  } catch (error) {
    console.error('Error cancelling job:', error);
    return NextResponse.json(
      { error: 'Failed to cancel job' },
      { status: 500 }
    );
  }
}
