import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUniqueFileName } from '@/utils'
import { getImages, createImage } from '@/lib/database/images'
import { upsertTags } from '@/lib/database/tags'
import sharp from 'sharp'

// Helper function to generate optimized thumbnails
async function generateThumbnails(buffer: Buffer, originalFileName: string, userPath: string) {
  const supabase = await createClient()
  const thumbnails: Record<string, string> = {}
  
  const sizes = [
    { name: 'small', width: 400, quality: 70 },
    { name: 'medium', width: 800, quality: 75 },
    { name: 'large', width: 1200, quality: 80 }
  ]
  
  try {
    for (const size of sizes) {
      const thumbnailBuffer = await sharp(buffer)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fastShrinkOnLoad: true 
        })
        .webp({ quality: size.quality })
        .toBuffer()
      
      const thumbnailPath = `${userPath}/thumbnails/${size.name}_${originalFileName.replace(/\.[^/.]+$/, '.webp')}`
      
      const { error: uploadError } = await supabase.storage
        .from('belka')
        .upload(thumbnailPath, thumbnailBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000' // 1 year cache
        })
      
      if (!uploadError) {
        thumbnails[size.name] = thumbnailPath
      }
    }
  } catch (error) {
    console.warn('Failed to generate thumbnails:', error)
  }
  
  return thumbnails
}

export async function GET() {
  try {
    // Get images using the new modular function
    const images = await getImages()

    // Create Supabase client to generate signed URLs
    const supabase = await createClient()

    // Generate signed URLs for each image with optimized caching
    const imagesWithSignedUrls = await Promise.all(
      images.map(async (image) => {
        const { data: signedUrlData } = await supabase.storage
          .from('belka')
          .createSignedUrl(image.image_path, 86400) // 24 hour expiry for better caching

        // Generate thumbnail URLs if they exist
        const thumbnailUrls: Record<string, string> = {}
        if (image.metadata && typeof image.metadata === 'object' && 'thumbnails' in image.metadata) {
          const thumbnails = image.metadata.thumbnails as Record<string, string>
          for (const [size, path] of Object.entries(thumbnails)) {
            const { data: thumbnailUrl } = await supabase.storage
              .from('belka')
              .createSignedUrl(path, 86400)
            if (thumbnailUrl?.signedUrl) {
              thumbnailUrls[size] = thumbnailUrl.signedUrl
            }
          }
        }

        return {
          ...image,
          image_url: signedUrlData?.signedUrl || null,
          thumbnail_urls: thumbnailUrls,
        }
      })
    )

    return NextResponse.json(imagesWithSignedUrls)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = JSON.parse(formData.get('tags') as string) as string[]
    
    // Get image dimensions from form data (sent from client)
    const widthStr = formData.get('width') as string
    const heightStr = formData.get('height') as string
    let width = widthStr ? parseInt(widthStr) : undefined
    let height = heightStr ? parseInt(heightStr) : undefined

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer())

    // If dimensions are missing or invalid, extract them server-side using sharp
    if (!width || !height || width <= 0 || height <= 0) {
      try {
        console.log('Client-side dimensions missing or invalid, extracting server-side...')
        const metadata = await sharp(buffer).metadata()
        
        if (metadata.width && metadata.height) {
          width = metadata.width
          height = metadata.height
          console.log(`Extracted dimensions server-side for ${file.name}:`, { width, height })
        }
      } catch (sharpError) {
        console.warn(`Could not extract dimensions server-side for ${file.name}:`, sharpError)
      }
    }

    // Create Supabase client for auth and storage
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fileName = generateUniqueFileName(file.name)
    const userPath = user.id
    const filePath = `${userPath}/${fileName}`

    // Upload original image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('belka')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Generate optimized thumbnails in background
    const thumbnails = await generateThumbnails(buffer, fileName, userPath)

    // Enhanced metadata with dimensions and thumbnails
    const metadata = {
      size: file.size,
      type: file.type,
      originalName: file.name,
      width: width || undefined,
      height: height || undefined,
      aspectRatio: width && height ? width / height : undefined,
      thumbnails, // Store thumbnail paths for faster loading
      uploadedAt: new Date().toISOString(),
    }

    // Create tags if they don't exist
    if (tags.length > 0) {
      await upsertTags(tags)
    }

    // Save to database using the new modular function
    const image = await createImage({
      title,
      description: description || '',
      tags,
      image_path: filePath,
      metadata,
    })

    // Generate signed URL for the response
    const { data: signedUrlData } = await supabase.storage
      .from('belka')
      .createSignedUrl(filePath, 86400) // 24 hour expiry

    // Generate thumbnail URLs for immediate use
    const thumbnailUrls: Record<string, string> = {}
    for (const [size, path] of Object.entries(thumbnails)) {
      const { data: thumbnailUrl } = await supabase.storage
        .from('belka')
        .createSignedUrl(path, 86400)
      if (thumbnailUrl?.signedUrl) {
        thumbnailUrls[size] = thumbnailUrl.signedUrl
      }
    }

    // Return response with signed URL and thumbnails
    const responseData = {
      ...image,
      image_url: signedUrlData?.signedUrl || null,
      thumbnail_urls: thumbnailUrls,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error creating image:', error)
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    )
  }
} 