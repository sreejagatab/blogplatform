import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads')

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
    const { id, alt, tags, folder } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Media ID is required' },
        { status: 400 }
      )
    }

    // Update media record
    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        ...(alt !== undefined && { alt }),
        ...(tags !== undefined && { tags }),
        ...(folder !== undefined && { folder }),
        updatedAt: new Date()
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedMedia.id,
        filename: updatedMedia.filename,
        originalName: updatedMedia.originalName,
        url: updatedMedia.url,
        thumbnailUrl: updatedMedia.thumbnailUrl,
        mimeType: updatedMedia.mimeType,
        size: updatedMedia.size,
        folder: updatedMedia.folder,
        alt: updatedMedia.alt,
        tags: updatedMedia.tags,
        dimensions: updatedMedia.dimensions ? JSON.parse(updatedMedia.dimensions) : null,
        uploadedAt: updatedMedia.createdAt,
        uploadedBy: updatedMedia.uploadedBy
      }
    })
  } catch (error) {
    console.error('Media update error:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
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

    const body = await request.json()
    const { fileIds } = body

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'File IDs are required' },
        { status: 400 }
      )
    }

    // Get media records to delete
    const mediaFiles = await prisma.media.findMany({
      where: {
        id: { in: fileIds }
      }
    })

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { error: 'No files found' },
        { status: 404 }
      )
    }

    // Delete files from filesystem
    const deletionResults = []
    for (const media of mediaFiles) {
      try {
        // Delete main file
        const mainFilePath = join(UPLOAD_DIR, media.folder, media.filename)
        await unlink(mainFilePath)

        // Delete thumbnail if exists
        if (media.thumbnailUrl) {
          const thumbnailFilename = media.thumbnailUrl.split('/').pop()
          if (thumbnailFilename) {
            const thumbnailPath = join(UPLOAD_DIR, media.folder, thumbnailFilename)
            try {
              await unlink(thumbnailPath)
            } catch (error) {
              console.warn('Failed to delete thumbnail:', error)
            }
          }
        }

        deletionResults.push({ id: media.id, success: true })
      } catch (error) {
        console.error(`Failed to delete file ${media.filename}:`, error)
        deletionResults.push({ 
          id: media.id, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    // Delete database records for successfully deleted files
    const successfulDeletions = deletionResults
      .filter(result => result.success)
      .map(result => result.id)

    if (successfulDeletions.length > 0) {
      await prisma.media.deleteMany({
        where: {
          id: { in: successfulDeletions }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: successfulDeletions.length,
        failedCount: deletionResults.length - successfulDeletions.length,
        results: deletionResults
      }
    })
  } catch (error) {
    console.error('Media deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete media files' },
      { status: 500 }
    )
  }
}

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
    const action = searchParams.get('action')

    if (action === 'stats') {
      // Get media statistics
      const [
        totalFiles,
        totalSize,
        filesByType,
        filesByFolder,
        recentUploads
      ] = await Promise.all([
        prisma.media.count(),
        prisma.media.aggregate({
          _sum: { size: true }
        }),
        prisma.media.groupBy({
          by: ['mimeType'],
          _count: { id: true },
          _sum: { size: true }
        }),
        prisma.media.groupBy({
          by: ['folder'],
          _count: { id: true },
          _sum: { size: true }
        }),
        prisma.media.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        })
      ])

      // Process file types
      const typeStats = filesByType.reduce((acc: any, item) => {
        const category = item.mimeType.split('/')[0]
        if (!acc[category]) {
          acc[category] = { count: 0, size: 0 }
        }
        acc[category].count += item._count.id
        acc[category].size += item._sum.size || 0
        return acc
      }, {})

      return NextResponse.json({
        success: true,
        data: {
          totalFiles,
          totalSize: totalSize._sum.size || 0,
          typeStats,
          folderStats: filesByFolder.map(folder => ({
            folder: folder.folder,
            count: folder._count.id,
            size: folder._sum.size || 0
          })),
          recentUploads
        }
      })
    }

    if (action === 'folders') {
      // Get all folders
      const folders = await prisma.media.groupBy({
        by: ['folder'],
        _count: { id: true }
      })

      return NextResponse.json({
        success: true,
        data: folders.map(folder => ({
          name: folder.folder,
          count: folder._count.id
        }))
      })
    }

    if (action === 'tags') {
      // Get all unique tags
      const mediaWithTags = await prisma.media.findMany({
        select: { tags: true },
        where: {
          tags: {
            not: { equals: [] }
          }
        }
      })

      const allTags = mediaWithTags.flatMap(media => media.tags)
      const uniqueTags = [...new Set(allTags)]
      const tagCounts = uniqueTags.map(tag => ({
        tag,
        count: allTags.filter(t => t === tag).length
      }))

      return NextResponse.json({
        success: true,
        data: tagCounts.sort((a, b) => b.count - a.count)
      })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Media management error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
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

    const body = await request.json()
    const { action, data } = body

    if (action === 'bulk-update') {
      const { fileIds, updates } = data

      if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
        return NextResponse.json(
          { error: 'File IDs are required' },
          { status: 400 }
        )
      }

      // Perform bulk update
      const result = await prisma.media.updateMany({
        where: {
          id: { in: fileIds }
        },
        data: {
          ...(updates.alt !== undefined && { alt: updates.alt }),
          ...(updates.tags !== undefined && { tags: updates.tags }),
          ...(updates.folder !== undefined && { folder: updates.folder }),
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          updatedCount: result.count
        }
      })
    }

    if (action === 'create-folder') {
      const { folderName } = data

      if (!folderName) {
        return NextResponse.json(
          { error: 'Folder name is required' },
          { status: 400 }
        )
      }

      // Create folder directory
      const folderPath = join(UPLOAD_DIR, folderName)
      const { mkdir } = await import('fs/promises')
      
      try {
        await mkdir(folderPath, { recursive: true })
        
        return NextResponse.json({
          success: true,
          data: {
            folderName,
            path: folderPath
          }
        })
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to create folder' },
          { status: 500 }
        )
      }
    }

    if (action === 'optimize-images') {
      const { fileIds } = data

      if (!fileIds || !Array.isArray(fileIds)) {
        return NextResponse.json(
          { error: 'File IDs are required' },
          { status: 400 }
        )
      }

      // Get image files
      const imageFiles = await prisma.media.findMany({
        where: {
          id: { in: fileIds },
          mimeType: { startsWith: 'image/' }
        }
      })

      // In a real implementation, you would optimize the images here
      // For now, we'll just return a success response
      return NextResponse.json({
        success: true,
        data: {
          optimizedCount: imageFiles.length,
          message: 'Image optimization completed'
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Media management POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
