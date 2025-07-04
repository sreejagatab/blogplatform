import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Define role permissions
const rolePermissions = {
  ADMIN: [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.delete',
    'posts.publish',
    'categories.create',
    'categories.read',
    'categories.update',
    'categories.delete',
    'comments.moderate',
    'comments.delete',
    'media.upload',
    'media.delete',
    'analytics.view',
    'settings.manage',
    'platforms.manage'
  ],
  EDITOR: [
    'posts.create',
    'posts.read',
    'posts.update',
    'posts.delete',
    'posts.publish',
    'categories.read',
    'categories.create',
    'comments.moderate',
    'media.upload',
    'analytics.view'
  ],
  USER: [
    'posts.read',
    'comments.create',
    'profile.update'
  ]
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const includePermissions = searchParams.get('includePermissions') === 'true'

    // Get all available roles
    const roles = Object.keys(rolePermissions).map(role => ({
      name: role,
      displayName: role.charAt(0) + role.slice(1).toLowerCase(),
      ...(includePermissions && { permissions: rolePermissions[role as keyof typeof rolePermissions] })
    }))

    // Get role statistics
    const roleStats = await Promise.all(
      Object.keys(rolePermissions).map(async (role) => {
        const count = await prisma.user.count({
          where: { role }
        })
        return { role, count }
      })
    )

    return NextResponse.json({
      roles,
      statistics: roleStats.reduce((acc, stat) => {
        acc[stat.role] = stat.count
        return acc
      }, {} as Record<string, number>)
    })
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, newRole, reason } = body

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: 'User ID and new role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!Object.keys(rolePermissions).includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    // Log role change (you might want to create an audit log table)
    console.log(`Role change: ${user.email} from ${user.role} to ${newRole} by ${session.user.email}. Reason: ${reason || 'No reason provided'}`)

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User role updated from ${user.role} to ${newRole}`
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}

// Check if user has specific permission
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { permission, userId } = body

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission is required' },
        { status: 400 }
      )
    }

    // Use current user if no userId provided
    const targetUserId = userId || session.user.id
    
    // Get user role
    let userRole = (session.user as any).role
    
    if (targetUserId !== session.user.id) {
      // Only admins can check permissions for other users
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }
      
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true }
      })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      
      userRole = user.role
    }

    // Check if user has permission
    const userPermissions = rolePermissions[userRole as keyof typeof rolePermissions] || []
    const hasPermission = userPermissions.includes(permission)

    return NextResponse.json({
      hasPermission,
      role: userRole,
      permission,
      userId: targetUserId
    })
  } catch (error) {
    console.error('Error checking permission:', error)
    return NextResponse.json(
      { error: 'Failed to check permission' },
      { status: 500 }
    )
  }
}
