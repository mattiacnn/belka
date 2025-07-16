import type { TravelImage, Tag, ImageMetadata } from '@/types'
import type { JsonValue } from '@prisma/client/runtime/library'

/**
 * Helper function to convert Prisma Image result to TravelImage
 * @param image - Prisma image object
 * @returns TravelImage with properly typed dates
 */
export function prismaImageToTravelImage(image: any): TravelImage {
  return {
    ...image,
    created_at: image.created_at.toISOString(),
    updated_at: image.updated_at.toISOString(),
    metadata: image.metadata as ImageMetadata | null,
  }
}

/**
 * Helper function to convert Prisma Tag result to Tag
 * @param tag - Prisma tag object
 * @returns Tag with properly typed dates
 */
export function prismaTagToTag(tag: any): Tag {
  return {
    ...tag,
    created_at: tag.created_at.toISOString(),
  }
}

/**
 * Helper to prepare update data for Prisma operations
 * @param data - Partial data to update
 * @returns Object with undefined values filtered out
 */
export function prepareUpdateData(data: Record<string, any>): Record<string, any> {
  const updateData: Record<string, any> = {}
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key] = value
    }
  })
  
  return updateData
} 