import { 
  DistributionEngine as IDistributionEngine, 
  DistributionJob, 
  PostResult, 
  BlogPost 
} from './types';
import { platformManager } from './platform-manager';
import { prisma } from '@/lib/prisma';

export class DistributionEngine implements IDistributionEngine {
  private jobQueue: Map<string, DistributionJob> = new Map();
  
  async distributePost(
    postId: string, 
    platforms: string[], 
    scheduledFor?: Date
  ): Promise<DistributionJob> {
    try {
      // Get the blog post from database
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              name: true,
              bio: true,
              image: true
            }
          },
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      
      if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
      }
      
      // Convert to BlogPost format
      const blogPost: BlogPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || undefined,
        featuredImage: post.featuredImage || undefined,
        author: {
          name: post.author.name || 'Unknown Author',
          bio: post.author.bio || undefined,
          avatar: post.author.image || undefined
        },
        category: post.category ? {
          name: post.category.name,
          slug: post.category.slug
        } : undefined,
        tags: post.tags.map(pt => pt.tag.name),
        publishedAt: post.publishedAt || undefined,
        updatedAt: post.updatedAt,
        seoTitle: post.metaTitle || undefined,
        seoDescription: post.metaDescription || undefined,
        canonicalUrl: post.canonicalUrl || undefined
      };
      
      // Create distribution job
      const job: DistributionJob = {
        id: this.generateJobId(),
        postId,
        platforms,
        scheduledFor,
        priority: scheduledFor ? 1 : 10, // Higher priority for immediate posts
        status: 'pending',
        results: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store job in queue
      this.jobQueue.set(job.id, job);
      
      // Process immediately if not scheduled
      if (!scheduledFor || scheduledFor <= new Date()) {
        await this.processJob(job, blogPost);
      } else {
        // Schedule job for later processing
        await this.scheduleJob(job, blogPost);
      }
      
      return job;
      
    } catch (error) {
      console.error('Failed to create distribution job:', error);
      throw error;
    }
  }
  
  private async processJob(job: DistributionJob, blogPost: BlogPost): Promise<void> {
    job.status = 'processing';
    job.updatedAt = new Date();
    
    try {
      // Process each platform
      const platformPromises = job.platforms.map(async (platform) => {
        return this.publishToPlatform(platform, blogPost, job.id);
      });
      
      // Wait for all platforms to complete
      const results = await Promise.allSettled(platformPromises);
      
      // Process results
      results.forEach((result, index) => {
        const platform = job.platforms[index];
        
        if (result.status === 'fulfilled') {
          job.results[platform] = result.value;
        } else {
          job.results[platform] = {
            success: false,
            errorMessage: result.reason?.message || 'Unknown error'
          };
        }
      });
      
      // Update job status
      const hasErrors = Object.values(job.results).some(result => !result.success);
      job.status = hasErrors ? 'failed' : 'completed';
      job.updatedAt = new Date();
      
      // Save results to database
      await this.saveJobResults(job);
      
    } catch (error) {
      job.status = 'failed';
      job.updatedAt = new Date();
      console.error('Failed to process distribution job:', error);
    }
  }
  
  private async publishToPlatform(
    platform: string, 
    blogPost: BlogPost, 
    jobId: string
  ): Promise<PostResult> {
    try {
      const adapter = platformManager.getAdapter(platform);
      if (!adapter) {
        throw new Error(`Platform adapter not found: ${platform}`);
      }
      
      // Check if platform is authenticated
      // In a real implementation, you would get user's credentials from database
      const isAuthenticated = await adapter.validateConnection();
      if (!isAuthenticated) {
        throw new Error(`Platform ${platform} is not authenticated`);
      }
      
      // Adapt content for the platform
      const adaptedContent = await adapter.adaptContent(blogPost);
      
      // Validate content
      const validation = await adapter.validateContent(adaptedContent);
      if (!validation.valid) {
        throw new Error(`Content validation failed: ${validation.errors?.join(', ')}`);
      }
      
      // Publish to platform
      const result = await adapter.publishPost(adaptedContent);
      
      // Save platform post record
      if (result.success) {
        await this.savePlatformPost(blogPost.id, platform, result, adaptedContent);
      }
      
      return result;
      
    } catch (error) {
      console.error(`Failed to publish to ${platform}:`, error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async savePlatformPost(
    postId: string, 
    platform: string, 
    result: PostResult,
    adaptedContent: any
  ): Promise<void> {
    try {
      // Get platform ID from database
      const platformRecord = await prisma.platform.findUnique({
        where: { name: platform }
      });
      
      if (!platformRecord) {
        console.error(`Platform ${platform} not found in database`);
        return;
      }
      
      // Create platform post record
      await prisma.platformPost.create({
        data: {
          postId,
          platformId: platformRecord.id,
          platformPostId: result.platformPostId,
          platformUrl: result.platformUrl,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          adaptedContent: JSON.stringify(adaptedContent),
          adaptedTitle: adaptedContent.title,
          hashtags: adaptedContent.hashtags?.join(','),
          metrics: JSON.stringify(result.metadata || {})
        }
      });
      
    } catch (error) {
      console.error('Failed to save platform post:', error);
    }
  }
  
  private async saveJobResults(job: DistributionJob): Promise<void> {
    try {
      // Save distribution job results to database
      // This would be implemented based on your schema
      console.log(`Job ${job.id} completed with status: ${job.status}`);
      
    } catch (error) {
      console.error('Failed to save job results:', error);
    }
  }
  
  private async scheduleJob(job: DistributionJob, blogPost: BlogPost): Promise<void> {
    // In a real implementation, you would use a job queue like Bull/BullMQ
    // For now, we'll use a simple setTimeout
    
    const delay = job.scheduledFor!.getTime() - new Date().getTime();
    
    setTimeout(() => {
      this.processJob(job, blogPost);
    }, delay);
    
    console.log(`Job ${job.id} scheduled for ${job.scheduledFor}`);
  }
  
  async getJobStatus(jobId: string): Promise<DistributionJob> {
    const job = this.jobQueue.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    return job;
  }
  
  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.jobQueue.get(jobId);
    if (!job) {
      return false;
    }
    
    if (job.status === 'processing') {
      return false; // Cannot cancel job that's already processing
    }
    
    job.status = 'cancelled';
    job.updatedAt = new Date();
    
    return true;
  }
  
  async retryFailedPlatforms(jobId: string): Promise<DistributionJob> {
    const job = this.jobQueue.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    // Get failed platforms
    const failedPlatforms = Object.entries(job.results)
      .filter(([, result]) => !result.success)
      .map(([platform]) => platform);
    
    if (failedPlatforms.length === 0) {
      return job; // No failed platforms to retry
    }
    
    // Create new job for failed platforms
    const retryJob = await this.distributePost(
      job.postId, 
      failedPlatforms, 
      job.scheduledFor
    );
    
    return retryJob;
  }
  
  async getBulkJobStatus(jobIds: string[]): Promise<DistributionJob[]> {
    return jobIds.map(jobId => {
      const job = this.jobQueue.get(jobId);
      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }
      return job;
    });
  }
  
  // Helper methods
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Get job statistics
  getJobStatistics(): {
    totalJobs: number;
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
    cancelledJobs: number;
  } {
    const jobs = Array.from(this.jobQueue.values());
    
    return {
      totalJobs: jobs.length,
      pendingJobs: jobs.filter(job => job.status === 'pending').length,
      processingJobs: jobs.filter(job => job.status === 'processing').length,
      completedJobs: jobs.filter(job => job.status === 'completed').length,
      failedJobs: jobs.filter(job => job.status === 'failed').length,
      cancelledJobs: jobs.filter(job => job.status === 'cancelled').length
    };
  }
  
  // Clean up old jobs
  cleanupOldJobs(olderThanDays: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const jobsToDelete: string[] = [];
    
    this.jobQueue.forEach((job, jobId) => {
      if (job.updatedAt < cutoffDate && 
          (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled')) {
        jobsToDelete.push(jobId);
      }
    });
    
    jobsToDelete.forEach(jobId => {
      this.jobQueue.delete(jobId);
    });
    
    console.log(`Cleaned up ${jobsToDelete.length} old jobs`);
  }
}

// Singleton instance
export const distributionEngine = new DistributionEngine();
