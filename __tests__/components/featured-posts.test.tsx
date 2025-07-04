import React from 'react'
import { render, screen } from '@testing-library/react'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { useQuery } from '@tanstack/react-query'

// Mock useQuery
jest.mock('@tanstack/react-query')
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>

describe('FeaturedPosts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any)

    render(<FeaturedPosts />)

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.loading-skeleton')
    expect(skeletons).toHaveLength(3)
  })

  it('renders featured posts when data is loaded', () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        excerpt: 'This is a test post excerpt',
        slug: 'test-post-1',
        publishedAt: '2024-01-01',
        author: { name: 'Test Author', avatar: '/avatar.jpg' },
        category: { name: 'Technology', slug: 'technology' },
        featuredImage: '/image1.jpg',
        readingTime: 5
      },
      {
        id: '2',
        title: 'Test Post 2',
        excerpt: 'This is another test post excerpt',
        slug: 'test-post-2',
        publishedAt: '2024-01-02',
        author: { name: 'Test Author 2', avatar: '/avatar2.jpg' },
        category: { name: 'Design', slug: 'design' },
        featuredImage: '/image2.jpg',
        readingTime: 3
      }
    ]

    mockUseQuery.mockReturnValue({
      data: mockPosts,
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<FeaturedPosts />)

    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('Test Post 2')).toBeInTheDocument()
    expect(screen.getByText('This is a test post excerpt')).toBeInTheDocument()
    expect(screen.getByText('This is another test post excerpt')).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch posts'),
    } as any)

    render(<FeaturedPosts />)

    expect(screen.getByText('No featured posts available.')).toBeInTheDocument()
  })

  it('renders empty state when no posts available', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<FeaturedPosts />)

    expect(screen.getByText('No featured posts available.')).toBeInTheDocument()
  })

  it('displays post metadata correctly', () => {
    const mockPost = {
      id: '1',
      title: 'Test Post with Metadata',
      excerpt: 'Test excerpt',
      slug: 'test-post-metadata',
      publishedAt: '2024-01-01',
      author: { name: 'John Doe', avatar: '/john.jpg' },
      category: { name: 'Technology', slug: 'technology' },
      featuredImage: '/featured.jpg',
      readingTime: 7
    }

    mockUseQuery.mockReturnValue({
      data: [mockPost],
      isLoading: false,
      isError: false,
      error: null,
    } as any)

    render(<FeaturedPosts />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('7 min read')).toBeInTheDocument()
  })
})
