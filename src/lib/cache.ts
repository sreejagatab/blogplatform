import Redis from 'ioredis'

// Redis connection with fallback for build time
let redis: Redis | null = null

// Only create Redis connection if REDIS_URL is available and we're not in build mode
// Skip Redis connection during build time to prevent connection errors
if (process.env.REDIS_URL &&
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'undefined' &&
    !process.env.VERCEL_ENV) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    })
  } catch (error) {
    console.warn('Redis connection failed, caching disabled:', error)
    redis = null
  }
}

export async function getCached<T>(
  key: string, 
  fallback: () => Promise<T>, 
  ttl: number = 3600
): Promise<T> {
  // If Redis is not available, just call the fallback
  if (!redis) {
    return await fallback()
  }

  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }
    
    const data = await fallback()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Cache error:', error)
    return await fallback()
  }
}

export async function setCached(
  key: string, 
  value: any, 
  ttl: number = 3600
): Promise<void> {
  if (!redis) return

  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCached(key: string): Promise<void> {
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

export async function clearCache(pattern?: string): Promise<void> {
  if (!redis) return

  try {
    if (pattern) {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } else {
      await redis.flushdb()
    }
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}

// Health check for Redis connection
export async function checkCacheHealth(): Promise<{ isHealthy: boolean; error?: string }> {
  if (!redis) {
    return { isHealthy: false, error: 'Redis not configured' }
  }

  try {
    await redis.ping()
    return { isHealthy: true }
  } catch (error) {
    return { 
      isHealthy: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export { redis }
