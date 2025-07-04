import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

const UPLOAD_DIR = join(process.cwd(), 'public/uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'text/markdown']

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'general'
    const tags = formData.get('tags') as string || ''
    const alt = formData.get('alt') as string || ''

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true })
    await mkdir(join(UPLOAD_DIR, folder), { recursive: true })

    const uploadedFiles = []
    const errors = []

    for (const file of files) {
      try {
        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          errors.push({ filename: file.name, error: validation.error })
          continue
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop()
        const uniqueFilename = `${uuidv4()}.${fileExtension}`
        const filePath = join(UPLOAD_DIR, folder, uniqueFilename)
        const publicUrl = `/uploads/${folder}/${uniqueFilename}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Process image files
        let processedBuffer = buffer
        let dimensions = null
        let thumbnailUrl = null

        if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
          const imageProcessing = await processImage(buffer, file.type)
          processedBuffer = imageProcessing.buffer
          dimensions = imageProcessing.dimensions
          
          // Generate thumbnail
          const thumbnailBuffer = await generateThumbnail(buffer)
          const thumbnailFilename = `thumb_${uniqueFilename}`
          const thumbnailPath = join(UPLOAD_DIR, folder, thumbnailFilename)
          await writeFile(thumbnailPath, thumbnailBuffer)
          thumbnailUrl = `/uploads/${folder}/${thumbnailFilename}`
        }

        // Save file
        await writeFile(filePath, processedBuffer)

        // Get file stats
        const stats = {
          size: processedBuffer.length,
          mimeType: file.type,
          originalName: file.name
        }

        // Save to database
        const mediaRecord = await prisma.media.create({
          data: {
            filename: uniqueFilename,
            originalName: file.name,
            mimeType: file.type,
            size: stats.size,
            url: publicUrl,
            thumbnailUrl,
            folder,
            alt: alt || file.name,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            dimensions: dimensions ? JSON.stringify(dimensions) : null,
            uploadedById: session.user.id,
            metadata: JSON.stringify({
              originalSize: file.size,
              processed: ALLOWED_IMAGE_TYPES.includes(file.type)
            })
          }
        })

        uploadedFiles.push({
          id: mediaRecord.id,
          filename: uniqueFilename,
          originalName: file.name,
          url: publicUrl,
          thumbnailUrl,
          size: stats.size,
          mimeType: file.type,
          dimensions,
          folder,
          alt: mediaRecord.alt,
          tags: mediaRecord.tags,
          uploadedAt: mediaRecord.createdAt
        })
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        errors.push({ 
          filename: file.name, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadedFiles,
        errors,
        summary: {
          total: files.length,
          successful: uploadedFiles.length,
          failed: errors.length
        }
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` 
    }
  }

  // Check file type
  const allowedTypes = [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_VIDEO_TYPES,
    ...ALLOWED_DOCUMENT_TYPES
  ]

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed` 
    }
  }

  return { valid: true }
}

async function processImage(buffer: Buffer, mimeType: string) {
  try {
    const image = sharp(buffer)
    const metadata = await image.metadata()
    
    // Optimize image
    let processedImage = image
    
    // Resize if too large
    if (metadata.width && metadata.width > 2048) {
      processedImage = processedImage.resize(2048, null, {
        withoutEnlargement: true
      })
    }

    // Convert to WebP for better compression (except GIFs)
    if (mimeType !== 'image/gif') {
      processedImage = processedImage.webp({ quality: 85 })
    }

    const processedBuffer = await processedImage.toBuffer()
    
    return {
      buffer: processedBuffer,
      dimensions: {
        width: metadata.width || 0,
        height: metadata.height || 0
      }
    }
  } catch (error) {
    console.error('Image processing error:', error)
    // Return original buffer if processing fails
    return {
      buffer,
      dimensions: null
    }
  }
}

async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toBuffer()
  } catch (error) {
    console.error('Thumbnail generation error:', error)
    throw error
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
    const folder = searchParams.get('folder')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (folder) {
      where.folder = folder
    }
    
    if (type) {
      where.mimeType = {
        startsWith: type + '/'
      }
    }
    
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    // Get media files
    const [mediaFiles, totalCount] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }),
      prisma.media.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        files: mediaFiles.map(file => ({
          id: file.id,
          filename: file.filename,
          originalName: file.originalName,
          url: file.url,
          thumbnailUrl: file.thumbnailUrl,
          mimeType: file.mimeType,
          size: file.size,
          folder: file.folder,
          alt: file.alt,
          tags: file.tags,
          dimensions: file.dimensions ? JSON.parse(file.dimensions) : null,
          uploadedAt: file.createdAt,
          uploadedBy: file.uploadedBy
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages
        }
      }
    })
  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}
