import sharp from 'sharp'

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  position?: string
  background?: string
  progressive?: boolean
  lossless?: boolean
}

export interface OptimizedImageResult {
  buffer: Buffer
  info: {
    format: string
    width: number
    height: number
    channels: number
    size: number
    density?: number
  }
  originalSize: number
  optimizedSize: number
  compressionRatio: number
}

export class ImageOptimizationService {
  private static instance: ImageOptimizationService
  
  static getInstance(): ImageOptimizationService {
    if (!ImageOptimizationService.instance) {
      ImageOptimizationService.instance = new ImageOptimizationService()
    }
    return ImageOptimizationService.instance
  }

  async optimizeImage(
    input: Buffer | string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImageResult> {
    try {
      const originalSize = Buffer.isBuffer(input) ? input.length : 0
      
      let image = sharp(input)
      const metadata = await image.metadata()

      // Apply transformations
      if (options.width || options.height) {
        image = image.resize(options.width, options.height, {
          fit: options.fit || 'cover',
          position: options.position || 'center',
          background: options.background || { r: 255, g: 255, b: 255, alpha: 1 },
          withoutEnlargement: true
        })
      }

      // Apply format-specific optimizations
      switch (options.format) {
        case 'webp':
          image = image.webp({
            quality: options.quality || 85,
            lossless: options.lossless || false,
            effort: 6
          })
          break
        case 'avif':
          image = image.avif({
            quality: options.quality || 80,
            lossless: options.lossless || false,
            effort: 4
          })
          break
        case 'jpeg':
          image = image.jpeg({
            quality: options.quality || 85,
            progressive: options.progressive !== false,
            mozjpeg: true
          })
          break
        case 'png':
          image = image.png({
            quality: options.quality || 90,
            progressive: options.progressive !== false,
            compressionLevel: 9,
            adaptiveFiltering: true
          })
          break
        default:
          // Auto-select best format
          if (metadata.hasAlpha) {
            image = image.webp({ quality: options.quality || 85 })
          } else {
            image = image.webp({ quality: options.quality || 85 })
          }
      }

      const result = await image.toBuffer({ resolveWithObject: true })
      
      return {
        buffer: result.data,
        info: result.info,
        originalSize,
        optimizedSize: result.data.length,
        compressionRatio: originalSize > 0 ? (originalSize - result.data.length) / originalSize : 0
      }
    } catch (error) {
      console.error('Image optimization error:', error)
      throw new Error(`Failed to optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateResponsiveImages(
    input: Buffer | string,
    sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
  ): Promise<Array<{ width: number; buffer: Buffer; size: number }>> {
    const results = []
    
    for (const width of sizes) {
      try {
        const optimized = await this.optimizeImage(input, {
          width,
          format: 'webp',
          quality: 85
        })
        
        results.push({
          width,
          buffer: optimized.buffer,
          size: optimized.optimizedSize
        })
      } catch (error) {
        console.error(`Failed to generate ${width}px variant:`, error)
      }
    }
    
    return results
  }

  async generateThumbnails(
    input: Buffer | string,
    sizes: Array<{ width: number; height: number; name: string }> = [
      { width: 150, height: 150, name: 'small' },
      { width: 300, height: 300, name: 'medium' },
      { width: 600, height: 600, name: 'large' }
    ]
  ): Promise<Array<{ name: string; buffer: Buffer; size: number }>> {
    const results = []
    
    for (const size of sizes) {
      try {
        const optimized = await this.optimizeImage(input, {
          width: size.width,
          height: size.height,
          format: 'webp',
          quality: 80,
          fit: 'cover'
        })
        
        results.push({
          name: size.name,
          buffer: optimized.buffer,
          size: optimized.optimizedSize
        })
      } catch (error) {
        console.error(`Failed to generate ${size.name} thumbnail:`, error)
      }
    }
    
    return results
  }

  async extractMetadata(input: Buffer | string) {
    try {
      const image = sharp(input)
      const metadata = await image.metadata()
      
      return {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        hasProfile: metadata.hasProfile,
        isAnimated: metadata.isAnimated,
        pages: metadata.pages,
        orientation: metadata.orientation,
        exif: metadata.exif,
        icc: metadata.icc,
        iptc: metadata.iptc,
        xmp: metadata.xmp
      }
    } catch (error) {
      console.error('Metadata extraction error:', error)
      throw new Error(`Failed to extract metadata: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async convertFormat(
    input: Buffer | string,
    targetFormat: 'webp' | 'jpeg' | 'png' | 'avif',
    quality: number = 85
  ): Promise<Buffer> {
    try {
      const optimized = await this.optimizeImage(input, {
        format: targetFormat,
        quality
      })
      
      return optimized.buffer
    } catch (error) {
      console.error('Format conversion error:', error)
      throw new Error(`Failed to convert to ${targetFormat}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async compressImage(
    input: Buffer | string,
    targetSizeKB?: number,
    maxQuality: number = 95,
    minQuality: number = 10
  ): Promise<OptimizedImageResult> {
    try {
      if (!targetSizeKB) {
        return await this.optimizeImage(input, { quality: 85 })
      }

      const targetSizeBytes = targetSizeKB * 1024
      let quality = maxQuality
      let result: OptimizedImageResult

      // Binary search for optimal quality
      let low = minQuality
      let high = maxQuality

      while (low <= high) {
        quality = Math.floor((low + high) / 2)
        result = await this.optimizeImage(input, { quality, format: 'webp' })

        if (result.optimizedSize <= targetSizeBytes) {
          low = quality + 1
        } else {
          high = quality - 1
        }
      }

      // Use the highest quality that meets the size requirement
      return await this.optimizeImage(input, { quality: high, format: 'webp' })
    } catch (error) {
      console.error('Image compression error:', error)
      throw new Error(`Failed to compress image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async createWatermark(
    input: Buffer | string,
    watermarkText: string,
    options: {
      position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
      opacity?: number
      fontSize?: number
      color?: string
    } = {}
  ): Promise<Buffer> {
    try {
      const image = sharp(input)
      const metadata = await image.metadata()
      
      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image dimensions')
      }

      const fontSize = options.fontSize || Math.max(metadata.width / 20, 24)
      const padding = fontSize / 2

      // Create watermark SVG
      const watermarkSvg = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <text 
            x="${getWatermarkX(options.position || 'bottom-right', metadata.width, watermarkText.length * fontSize * 0.6, padding)}"
            y="${getWatermarkY(options.position || 'bottom-right', metadata.height, fontSize, padding)}"
            font-family="Arial, sans-serif"
            font-size="${fontSize}"
            fill="${options.color || 'white'}"
            fill-opacity="${options.opacity || 0.7}"
            stroke="black"
            stroke-width="1"
            stroke-opacity="0.3"
          >${watermarkText}</text>
        </svg>
      `

      const watermarkBuffer = Buffer.from(watermarkSvg)

      const result = await image
        .composite([{ input: watermarkBuffer, blend: 'over' }])
        .toBuffer()

      return result
    } catch (error) {
      console.error('Watermark creation error:', error)
      throw new Error(`Failed to create watermark: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

function getWatermarkX(position: string, imageWidth: number, textWidth: number, padding: number): number {
  switch (position) {
    case 'top-left':
    case 'bottom-left':
      return padding
    case 'top-right':
    case 'bottom-right':
      return imageWidth - textWidth - padding
    case 'center':
      return (imageWidth - textWidth) / 2
    default:
      return imageWidth - textWidth - padding
  }
}

function getWatermarkY(position: string, imageHeight: number, fontSize: number, padding: number): number {
  switch (position) {
    case 'top-left':
    case 'top-right':
      return fontSize + padding
    case 'bottom-left':
    case 'bottom-right':
      return imageHeight - padding
    case 'center':
      return imageHeight / 2
    default:
      return imageHeight - padding
  }
}

// Export singleton instance
export const imageOptimizationService = ImageOptimizationService.getInstance()
