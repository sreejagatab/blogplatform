import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['ADMIN', 'EDITOR'],
  '/admin/users': ['ADMIN'],
  '/admin/settings': ['ADMIN'],
  '/admin/analytics': ['ADMIN', 'EDITOR'],
  '/admin/posts': ['ADMIN', 'EDITOR'],
  '/admin/categories': ['ADMIN', 'EDITOR'],
  '/admin/comments': ['ADMIN', 'EDITOR'],
  '/admin/media': ['ADMIN', 'EDITOR'],
  '/api/admin': ['ADMIN', 'EDITOR'],
  '/api/admin/users': ['ADMIN'],
  '/api/admin/settings': ['ADMIN'],
  '/profile': ['USER', 'EDITOR', 'ADMIN'],
  '/dashboard': ['USER', 'EDITOR', 'ADMIN']
}

// Rate limiting configuration
const rateLimits = {
  '/api/auth': { requests: 10, window: 60000 }, // 10 requests per minute
  '/api/posts': { requests: 100, window: 60000 }, // 100 requests per minute
  '/api/admin': { requests: 200, window: 60000 }, // 200 requests per minute for admin
  '/api/ai': { requests: 20, window: 60000 }, // 20 AI requests per minute
  '/api/newsletter': { requests: 5, window: 60000 } // 5 newsletter requests per minute
}

// In-memory rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest, route: string): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return `${ip}:${route}`
}

function checkRateLimit(request: NextRequest, route: string): boolean {
  const config = rateLimits[route as keyof typeof rateLimits]
  if (!config) return true

  const key = getRateLimitKey(request, route)
  const now = Date.now()
  const stored = rateLimitStore.get(key)

  if (!stored || now > stored.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window })
    return true
  }

  if (stored.count >= config.requests) {
    return false
  }

  stored.count++
  return true
}

function getMatchingRoute(pathname: string): string | null {
  // Check for exact matches first
  if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
    return pathname
  }

  // Check for prefix matches
  for (const route of Object.keys(protectedRoutes)) {
    if (pathname.startsWith(route + '/') || pathname.startsWith(route)) {
      return route
    }
  }

  return null
}

function getMatchingRateLimit(pathname: string): string | null {
  for (const route of Object.keys(rateLimits)) {
    if (pathname.startsWith(route)) {
      return route
    }
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check rate limiting
  const rateLimitRoute = getMatchingRateLimit(pathname)
  if (rateLimitRoute && !checkRateLimit(request, rateLimitRoute)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // Check if route requires authentication
  const matchingRoute = getMatchingRoute(pathname)
  if (!matchingRoute) {
    return NextResponse.next()
  }

  // Get session
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const requiredRoles = protectedRoutes[matchingRoute as keyof typeof protectedRoutes]
  const userRole = (session.user as any).role

  if (!requiredRoles.includes(userRole)) {
    // Redirect to unauthorized page or home
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Add security headers
  const response = NextResponse.next()
  
  // CSRF protection
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: 'CSRF protection: Origin mismatch' },
        { status: 403 }
      )
    }
  }

  // Add user info to headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('x-user-id', session.user.id)
    response.headers.set('x-user-role', userRole)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
