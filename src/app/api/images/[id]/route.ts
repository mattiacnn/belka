import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getImageById, updateImage, deleteImage } from '@/lib/database/images'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await getImageById(params.id)

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Create Supabase client to generate signed URL
    const supabase = await createClient()
    const { data: signedUrlData } = await supabase.storage
      .from('belka')
      .createSignedUrl(image.image_path, 3600) // 1 hour expiry

    const imageWithSignedUrl = {
      ...image,
      image_url: signedUrlData?.signedUrl || null,
    }

    return NextResponse.json(imageWithSignedUrl)
  } catch (error) {
    console.error('Error fetching image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const updatedImage = await updateImage(params.id, data)

    if (!updatedImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Create Supabase client to generate signed URL
    const supabase = await createClient()
    const { data: signedUrlData } = await supabase.storage
      .from('belka')
      .createSignedUrl(updatedImage.image_path, 3600) // 1 hour expiry

    const imageWithSignedUrl = {
      ...updatedImage,
      image_url: signedUrlData?.signedUrl || null,
    }

    return NextResponse.json(imageWithSignedUrl)
  } catch (error) {
    console.error('Error updating image:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get image details before deletion
    const image = await getImageById(params.id)
    
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }
    
    // Delete from database
    await deleteImage(params.id)

    // Delete from storage
    const supabase = await createClient()
    const { error: deleteError } = await supabase.storage
      .from('belka')
      .remove([image.image_path])

    if (deleteError) {
      console.warn('Warning: Could not delete file from storage:', deleteError)
      // Don't fail the request if storage deletion fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}