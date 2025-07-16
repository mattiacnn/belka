import { prisma } from '../prisma'
import { getCurrentUser } from './auth'
import { prismaTagToTag } from './types'
import type { Tag } from '@/types'

/**
 * Get all tags for the current user
 * @returns Promise<Tag[]> - Array of user's tags ordered alphabetically
 */
export async function getTags(): Promise<Tag[]> {
  const user = await getCurrentUser()
  
  const tags = await prisma.tag.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      name: 'asc',
    },
  })
  
  return tags.map(prismaTagToTag)
}

/**
 * Search tags by name for the current user
 * @param query - Search query string
 * @returns Promise<Tag[]> - Array of matching tags (max 10)
 */
export async function searchTags(query: string): Promise<Tag[]> {
  const user = await getCurrentUser()
  
  const tags = await prisma.tag.findMany({
    where: {
      user_id: user.id,
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: {
      name: 'asc',
    },
    take: 10,
  })
  
  return tags.map(prismaTagToTag)
}

/**
 * Create or update tags for the current user
 * @param tagNames - Array of tag names to create/update
 * @returns Promise<Tag[]> - Array of created/updated tags
 */
export async function upsertTags(tagNames: string[]): Promise<Tag[]> {
  const user = await getCurrentUser()
  
  const tags = await Promise.all(
    tagNames.map(async (tagName) => {
      const tag = await prisma.tag.upsert({
        where: {
          name_user_id: {
            name: tagName,
            user_id: user.id,
          },
        },
        update: {},
        create: {
          name: tagName,
          user_id: user.id,
        },
      })
      return prismaTagToTag(tag)
    })
  )
  
  return tags
}

/**
 * Get tag usage statistics
 * @returns Promise<Array<{name: string, count: number}>> - Tags with usage count
 */
export async function getTagUsageStats(): Promise<Array<{name: string, count: number}>> {
  const user = await getCurrentUser()
  
  // Get all images with their tags
  const images = await prisma.image.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      tags: true,
    },
  })
  
  // Count tag usage
  const tagCounts = new Map<string, number>()
  
  images.forEach(image => {
    image.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  // Convert to array and sort by usage count
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Clean up unused tags for the current user
 * @returns Promise<number> - Number of tags deleted
 */
export async function cleanupUnusedTags(): Promise<number> {
  const user = await getCurrentUser()
  
  // Get all tags for user
  const allTags = await prisma.tag.findMany({
    where: {
      user_id: user.id,
    },
  })
  
  // Get all used tag names from images
  const images = await prisma.image.findMany({
    where: {
      user_id: user.id,
    },
    select: {
      tags: true,
    },
  })
  
  const usedTagNames = new Set(
    images.flatMap(image => image.tags)
  )
  
  // Delete unused tags
  const unusedTags = allTags.filter(tag => !usedTagNames.has(tag.name))
  
  if (unusedTags.length > 0) {
    await prisma.tag.deleteMany({
      where: {
        id: {
          in: unusedTags.map(tag => tag.id),
        },
      },
    })
  }
  
  return unusedTags.length
}

/**
 * Delete a specific tag by name for the current user
 * @param tagName - Name of the tag to delete
 * @returns Promise<boolean> - Whether the tag was found and deleted
 */
export async function deleteTag(tagName: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  try {
    await prisma.tag.delete({
      where: {
        name_user_id: {
          name: tagName,
          user_id: user.id,
        },
      },
    })
    return true
  } catch (error) {
    // Tag not found
    return false
  }
} 