import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Mock publishing jobs data
// In production, this would come from a job queue like Bull, Agenda, or similar
interface PublishingJob {
  id: string
  postId: string
  postTitle: string
  platforms: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  scheduledFor: Date
  createdAt: Date
  updatedAt: Date
  progress: number
  results?: {
    platform: string
    status: 'success' | 'failed'
    publishedUrl?: string
    error?: string
  }[]
  metadata: {
    totalPlatforms: number
    completedPlatforms: number
    failedPlatforms: number
  }
}

// In-memory storage for demo purposes
const publishingJobs = new Map<string, PublishingJob>([
  ['job_1', {
    id: 'job_1',
    postId: 'post_123',
    postTitle: 'Getting Started with Universal Blog Platform',
    platforms: ['LinkedIn', 'Twitter', 'Medium'],
    status: 'completed',
    scheduledFor: new Date('2024-01-20T10:00:00Z'),
    createdAt: new Date('2024-01-20T09:45:00Z'),
    updatedAt: new Date('2024-01-20T10:15:00Z'),
    progress: 100,
    results: [
      {
        platform: 'LinkedIn',
        status: 'success',
        publishedUrl: 'https://linkedin.com/posts/example-123'
      },
      {
        platform: 'Twitter',
        status: 'success',
        publishedUrl: 'https://twitter.com/user/status/123'
      },
      {
        platform: 'Medium',
        status: 'success',
        publishedUrl: 'https://medium.com/@user/post-123'
      }
    ],
    metadata: {
      totalPlatforms: 3,
      completedPlatforms: 3,
      failedPlatforms: 0
    }
  }],
  ['job_2', {
    id: 'job_2',
    postId: 'post_124',
    postTitle: 'Advanced AI Writing Features',
    platforms: ['LinkedIn', 'Twitter', 'Dev.to'],
    status: 'processing',
    scheduledFor: new Date('2024-01-21T14:30:00Z'),
    createdAt: new Date('2024-01-21T14:25:00Z'),
    updatedAt: new Date('2024-01-21T14:32:00Z'),
    progress: 66,
    results: [
      {
        platform: 'LinkedIn',
        status: 'success',
        publishedUrl: 'https://linkedin.com/posts/example-124'
      },
      {
        platform: 'Twitter',
        status: 'success',
        publishedUrl: 'https://twitter.com/user/status/124'
      }
    ],
    metadata: {
      totalPlatforms: 3,
      completedPlatforms: 2,
      failedPlatforms: 0
    }
  }],
  ['job_3', {
    id: 'job_3',
    postId: 'post_125',
    postTitle: 'Content Scheduling Best Practices',
    platforms: ['LinkedIn', 'Medium', 'Facebook'],
    status: 'pending',
    scheduledFor: new Date('2024-01-22T09:00:00Z'),
    createdAt: new Date('2024-01-21T16:00:00Z'),
    updatedAt: new Date('2024-01-21T16:00:00Z'),
    progress: 0,
    metadata: {
      totalPlatforms: 3,
      completedPlatforms: 0,
      failedPlatforms: 0
    }
  }]
])

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
    const status = searchParams.get('status')
    const postId = searchParams.get('postId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredJobs = Array.from(publishingJobs.values())

    // Apply filters
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status)
    }

    if (postId) {
      filteredJobs = filteredJobs.filter(job => job.postId === postId)
    }

    // Sort by creation date (newest first)
    filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const paginatedJobs = filteredJobs.slice(offset, offset + limit)

    // Calculate statistics
    const stats = {
      total: filteredJobs.length,
      pending: filteredJobs.filter(j => j.status === 'pending').length,
      processing: filteredJobs.filter(j => j.status === 'processing').length,
      completed: filteredJobs.filter(j => j.status === 'completed').length,
      failed: filteredJobs.filter(j => j.status === 'failed').length,
      cancelled: filteredJobs.filter(j => j.status === 'cancelled').length
    }

    return NextResponse.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          limit,
          offset,
          total: filteredJobs.length,
          hasMore: offset + limit < filteredJobs.length
        },
        stats
      }
    })
  } catch (error) {
    console.error('Publishing jobs GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch publishing jobs' },
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

    const { postId, postTitle, platforms, scheduledFor } = await request.json()

    if (!postId || !postTitle || !platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, postTitle, platforms' },
        { status: 400 }
      )
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    const scheduledDate = scheduledFor ? new Date(scheduledFor) : now

    const newJob: PublishingJob = {
      id: jobId,
      postId,
      postTitle,
      platforms,
      status: scheduledDate > now ? 'pending' : 'processing',
      scheduledFor: scheduledDate,
      createdAt: now,
      updatedAt: now,
      progress: 0,
      metadata: {
        totalPlatforms: platforms.length,
        completedPlatforms: 0,
        failedPlatforms: 0
      }
    }

    publishingJobs.set(jobId, newJob)

    // In a real implementation, you would:
    // 1. Add the job to a queue (Bull, Agenda, etc.)
    // 2. Set up workers to process the job
    // 3. Handle retries and error recovery
    // 4. Send webhooks/notifications on completion

    return NextResponse.json({
      success: true,
      data: {
        job: newJob
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Publishing jobs POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create publishing job' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const job = publishingJobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const { action } = await request.json()

    switch (action) {
      case 'cancel':
        if (job.status === 'pending' || job.status === 'processing') {
          job.status = 'cancelled'
          job.updatedAt = new Date()
          publishingJobs.set(jobId, job)
          
          return NextResponse.json({
            success: true,
            data: { job },
            message: 'Job cancelled successfully'
          })
        } else {
          return NextResponse.json(
            { error: 'Job cannot be cancelled in current status' },
            { status: 400 }
          )
        }

      case 'retry':
        if (job.status === 'failed') {
          job.status = 'pending'
          job.progress = 0
          job.updatedAt = new Date()
          job.results = []
          job.metadata.completedPlatforms = 0
          job.metadata.failedPlatforms = 0
          publishingJobs.set(jobId, job)
          
          return NextResponse.json({
            success: true,
            data: { job },
            message: 'Job queued for retry'
          })
        } else {
          return NextResponse.json(
            { error: 'Only failed jobs can be retried' },
            { status: 400 }
          )
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Publishing jobs PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update publishing job' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const job = publishingJobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of completed, failed, or cancelled jobs
    if (['completed', 'failed', 'cancelled'].includes(job.status)) {
      publishingJobs.delete(jobId)
      
      return NextResponse.json({
        success: true,
        message: 'Job deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Cannot delete active jobs. Cancel the job first.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Publishing jobs DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete publishing job' },
      { status: 500 }
    )
  }
}
