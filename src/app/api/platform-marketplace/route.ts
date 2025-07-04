import { NextRequest, NextResponse } from 'next/server'
import { auth as getServerSession, authOptions } from '@/lib/auth'
import { platformRegistry } from '@/lib/platforms/marketplace/platform-adapter-registry'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const installAdapterSchema = z.object({
  adapterId: z.string().min(1, 'Adapter ID is required'),
  configuration: z.record(z.any()).optional()
})

const updateAdapterSchema = z.object({
  adapterId: z.string().min(1, 'Adapter ID is required'),
  configuration: z.record(z.any()),
  enabled: z.boolean().optional()
})

// GET /api/platform-marketplace - Get available platform adapters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const installed = searchParams.get('installed') === 'true'

    // Get all available adapters
    let adapters = platformRegistry.getAllAdapters()

    // Filter by category if specified
    if (category) {
      adapters = platformRegistry.getAdaptersByCategory(category as any)
    }

    // Filter by search query if specified
    if (search) {
      adapters = platformRegistry.searchAdapters(search)
    }

    // Get user's installed adapters
    const userAdapters = await prisma.platformIntegration.findMany({
      where: { userId: session.user.id },
      select: {
        platformId: true,
        isActive: true,
        configuration: true,
        createdAt: true,
        lastUsedAt: true
      }
    })

    const installedAdapterIds = new Set(userAdapters.map(ua => ua.platformId))

    // Prepare adapter data
    const adapterData = adapters.map(adapter => {
      const metadata = platformRegistry.getAdapterMetadata(adapter.id)
      const userAdapter = userAdapters.find(ua => ua.platformId === adapter.id)
      
      return {
        ...metadata,
        installed: installedAdapterIds.has(adapter.id),
        enabled: userAdapter?.isActive || false,
        installedAt: userAdapter?.createdAt,
        lastUsedAt: userAdapter?.lastUsedAt,
        hasConfiguration: userAdapter?.configuration ? true : false
      }
    })

    // Filter by installation status if specified
    const filteredAdapters = installed 
      ? adapterData.filter(adapter => adapter.installed)
      : adapterData

    // Group by category for better organization
    const categorizedAdapters = filteredAdapters.reduce((acc, adapter) => {
      if (!acc[adapter.category]) {
        acc[adapter.category] = []
      }
      acc[adapter.category].push(adapter)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      adapters: filteredAdapters,
      categorized: categorizedAdapters,
      totalCount: filteredAdapters.length,
      installedCount: adapterData.filter(a => a.installed).length,
      availableCategories: Object.keys(categorizedAdapters)
    })
  } catch (error) {
    console.error('Failed to fetch platform marketplace:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform marketplace' },
      { status: 500 }
    )
  }
}

// POST /api/platform-marketplace - Install a platform adapter
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = installAdapterSchema.parse(body)

    // Check if adapter exists in registry
    const adapter = platformRegistry.getAdapter(validatedData.adapterId)
    if (!adapter) {
      return NextResponse.json(
        { error: 'Platform adapter not found' },
        { status: 404 }
      )
    }

    // Check if already installed
    const existingInstallation = await prisma.platformIntegration.findFirst({
      where: {
        userId: session.user.id,
        platformId: validatedData.adapterId
      }
    })

    if (existingInstallation) {
      return NextResponse.json(
        { error: 'Platform adapter is already installed' },
        { status: 409 }
      )
    }

    // Validate configuration if provided
    if (validatedData.configuration) {
      const validation = await adapter.validateConfiguration(validatedData.configuration)
      if (!validation.valid) {
        return NextResponse.json(
          { 
            error: 'Configuration validation failed',
            details: validation.errors
          },
          { status: 400 }
        )
      }
    }

    // Install the adapter
    const installation = await prisma.platformIntegration.create({
      data: {
        userId: session.user.id,
        platformId: validatedData.adapterId,
        platformName: adapter.name,
        configuration: validatedData.configuration || {},
        isActive: validatedData.configuration ? true : false, // Only activate if configured
        capabilities: adapter.capabilities as any,
        version: adapter.version
      }
    })

    // Initialize adapter if configuration provided
    if (validatedData.configuration) {
      try {
        await adapter.initialize(validatedData.configuration)
        
        // Update installation status
        await prisma.platformIntegration.update({
          where: { id: installation.id },
          data: { 
            lastUsedAt: new Date(),
            status: 'active'
          }
        })
      } catch (error) {
        // If initialization fails, mark as needs configuration
        await prisma.platformIntegration.update({
          where: { id: installation.id },
          data: { 
            isActive: false,
            status: 'configuration_required',
            lastError: error instanceof Error ? error.message : 'Initialization failed'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      installation,
      message: `${adapter.name} adapter installed successfully`
    })
  } catch (error) {
    console.error('Failed to install platform adapter:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to install platform adapter' },
      { status: 500 }
    )
  }
}

// PUT /api/platform-marketplace - Update adapter configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateAdapterSchema.parse(body)

    // Check if adapter is installed
    const installation = await prisma.platformIntegration.findFirst({
      where: {
        userId: session.user.id,
        platformId: validatedData.adapterId
      }
    })

    if (!installation) {
      return NextResponse.json(
        { error: 'Platform adapter is not installed' },
        { status: 404 }
      )
    }

    // Get adapter from registry
    const adapter = platformRegistry.getAdapter(validatedData.adapterId)
    if (!adapter) {
      return NextResponse.json(
        { error: 'Platform adapter not found in registry' },
        { status: 404 }
      )
    }

    // Validate new configuration
    const validation = await adapter.validateConfiguration(validatedData.configuration)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Configuration validation failed',
          details: validation.errors,
          warnings: validation.warnings
        },
        { status: 400 }
      )
    }

    // Test adapter initialization with new configuration
    try {
      await adapter.initialize(validatedData.configuration)
      
      // Update installation
      const updatedInstallation = await prisma.platformIntegration.update({
        where: { id: installation.id },
        data: {
          configuration: validatedData.configuration,
          isActive: validatedData.enabled ?? true,
          status: 'active',
          lastUsedAt: new Date(),
          lastError: null,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        installation: updatedInstallation,
        message: `${adapter.name} adapter updated successfully`,
        warnings: validation.warnings
      })
    } catch (error) {
      // If initialization fails, save config but mark as inactive
      await prisma.platformIntegration.update({
        where: { id: installation.id },
        data: {
          configuration: validatedData.configuration,
          isActive: false,
          status: 'configuration_error',
          lastError: error instanceof Error ? error.message : 'Configuration test failed',
          updatedAt: new Date()
        }
      })

      return NextResponse.json(
        { 
          error: 'Configuration test failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to update platform adapter:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update platform adapter' },
      { status: 500 }
    )
  }
}

// DELETE /api/platform-marketplace - Uninstall platform adapter
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const adapterId = searchParams.get('adapterId')

    if (!adapterId) {
      return NextResponse.json(
        { error: 'Adapter ID is required' },
        { status: 400 }
      )
    }

    // Check if adapter is installed
    const installation = await prisma.platformIntegration.findFirst({
      where: {
        userId: session.user.id,
        platformId: adapterId
      }
    })

    if (!installation) {
      return NextResponse.json(
        { error: 'Platform adapter is not installed' },
        { status: 404 }
      )
    }

    // Delete the installation (this will cascade to related data)
    await prisma.platformIntegration.delete({
      where: { id: installation.id }
    })

    return NextResponse.json({
      success: true,
      message: `Platform adapter uninstalled successfully`
    })
  } catch (error) {
    console.error('Failed to uninstall platform adapter:', error)
    return NextResponse.json(
      { error: 'Failed to uninstall platform adapter' },
      { status: 500 }
    )
  }
}
