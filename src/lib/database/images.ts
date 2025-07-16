import { prisma } from '../prisma'
import { getCurrentUser } from './auth'
import { prismaImageToTravelImage, prepareUpdateData } from './types'
import type { TravelImage, ImageMetadata } from '@/types'

/**
 * Create a new image record in the database
 * @param data - Image data including file info and metadata
 * @returns Promise<TravelImage> - Created image object
 */
export async function createImage(data: { 
  title: string
  description?: string
  tags: string[]
  image_path: string 
  metadata?: ImageMetadata 
}): Promise<TravelImage> {
  const user = await getCurrentUser()
  
  const image = await prisma.image.create({
    data: {
      title: data.title,
      description: data.description || null,
      image_path: data.image_path,
      tags: data.tags,
      user_id: user.id,
      metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
    },
  })
  
  return prismaImageToTravelImage(image)
}

/**
 * Get all images for the current user
 * @returns Promise<TravelImage[]> - Array of user's images ordered by creation date
 */
export async function getImages(): Promise<TravelImage[]> {
  const user = await getCurrentUser()
  
  const images = await prisma.image.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  
  return images.map(prismaImageToTravelImage)
}

/**
 * Get a specific image by ID for the current user
 * @param id - Image ID
 * @returns Promise<TravelImage | null> - Image object or null if not found
 */
export async function getImageById(id: string): Promise<TravelImage | null> {
  const user = await getCurrentUser()
  
  const image = await prisma.image.findFirst({
    where: {
      id,
      user_id: user.id,
    },
  })
  
  return image ? prismaImageToTravelImage(image) : null
}

/**
 * Update an existing image
 * @param id - Image ID to update
 * @param data - Partial image data to update
 * @returns Promise<TravelImage> - Updated image object
 */
export async function updateImage(
  id: string, 
  data: Partial<Omit<TravelImage, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
): Promise<TravelImage> {
  const user = await getCurrentUser()
  
  const updateData = prepareUpdateData({
    title: data.title,
    description: data.description,
    image_path: data.image_path,
    tags: data.tags,
    metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined,
  })
  
  const image = await prisma.image.update({
    where: {
      id,
      user_id: user.id,
    },
    data: updateData,
  })
  
  return prismaImageToTravelImage(image)
}

/**
 * Delete an image by ID for the current user
 * @param id - Image ID to delete
 * @returns Promise<void>
 */
export async function deleteImage(id: string): Promise<void> {
  const user = await getCurrentUser()
  
  await prisma.image.delete({
    where: {
      id,
      user_id: user.id,
    },
  })
}

/**
 * Get images by tag for the current user
 * @param tagName - Tag name to filter by
 * @returns Promise<TravelImage[]> - Array of images with the specified tag
 */
export async function getImagesByTag(tagName: string): Promise<TravelImage[]> {
  const user = await getCurrentUser()
  
  const images = await prisma.image.findMany({
    where: {
      user_id: user.id,
      tags: {
        has: tagName,
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  
  return images.map(prismaImageToTravelImage)
}