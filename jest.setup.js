import '@testing-library/jest-dom'
import React from 'react'

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { ...props, alt: props.alt })
  },
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }) => {
    return React.createElement('a', { href, ...props }, children)
  },
}))



// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}))

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
  })),
  useInfiniteQuery: () => ({
    data: { pages: [{ posts: [] }] },
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    status: 'success',
  }),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
}))

// Mock OpenAI
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI response' } }]
        })
      }
    }
  }))
}))

// Mock fetch for Node.js environment
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Mock Prisma Client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-user-id',
        email: data.data?.email || 'test@example.com',
        name: data.data?.name || 'Test User',
        role: data.data?.role || 'ADMIN'
      })),
      findUnique: jest.fn().mockResolvedValue({ id: 'mock-user-id', email: 'test@example.com', name: 'Test User', role: 'ADMIN' }),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    post: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-post-id',
        title: data.data?.title || 'Test Post',
        content: data.data?.content || 'Test content',
        status: data.data?.status || 'PUBLISHED',
        authorId: data.data?.authorId || 'mock-user-id',
        categoryId: data.data?.categoryId || 'mock-category-id',
        slug: data.data?.slug || 'test-post',
        author: { id: 'mock-user-id', name: 'Test User', email: 'test@example.com' },
        category: { id: 'mock-category-id', name: 'Test Category', slug: 'test-category' }
      })),
      findUnique: jest.fn().mockResolvedValue({ id: 'mock-post-id', title: 'Test Post', content: 'Test content', status: 'PUBLISHED' }),
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-post-id',
        title: data.data?.title || 'Updated Post',
        content: data.data?.content || 'Updated content',
        status: 'PUBLISHED'
      })),
      delete: jest.fn().mockResolvedValue(null),
      deleteMany: jest.fn(),
    },
    category: {
      create: jest.fn().mockResolvedValue({ id: 'mock-category-id', name: 'Test Category', slug: 'test-category' }),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    comment: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-comment-id',
        content: data.data?.content || 'Test comment',
        postId: data.data?.postId || 'mock-post-id',
        authorId: data.data?.authorId || 'mock-user-id'
      })),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    media: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-media-id',
        filename: data.data?.filename || 'test.jpg',
        mimeType: data.data?.mimeType || 'image/jpeg',
        uploadedById: data.data?.uploadedById || 'mock-user-id'
      })),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    pageView: {
      create: jest.fn().mockImplementation((data) => Promise.resolve({
        id: 'mock-pageview-id',
        postId: data.data?.postId || 'mock-post-id',
        path: data.data?.path || '/blog/test-post',
        userAgent: data.data?.userAgent || 'test-agent',
        ip: data.data?.ip || '127.0.0.1'
      })),
      createMany: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn().mockResolvedValue([{ _count: { id: 2 } }]),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  }
}))

// Suppress console warnings in tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('Error:'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})

// Mock Publishing Queue
jest.mock('@/lib/platforms/publishing-queue', () => ({
  PublishingQueue: jest.fn().mockImplementation(() => ({
    addToQueue: jest.fn().mockResolvedValue({
      success: true,
      jobIds: ['mock-job-1', 'mock-job-2', 'mock-job-3'],
    }),
    processQueue: jest.fn().mockResolvedValue(undefined),
    startProcessing: jest.fn(),
    stopProcessing: jest.fn(),
    getQueueStatus: jest.fn().mockReturnValue({
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    }),
  })),
  publishingQueue: {
    addToQueue: jest.fn().mockResolvedValue({
      success: true,
      jobIds: ['mock-job-1', 'mock-job-2', 'mock-job-3'],
    }),
    processQueue: jest.fn().mockResolvedValue(undefined),
    startProcessing: jest.fn(),
    stopProcessing: jest.fn(),
    getQueueStatus: jest.fn().mockReturnValue({
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    }),
  }
}))
