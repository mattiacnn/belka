'use client'

import { memo } from 'react'
import { TagsSelector } from '@/components/ui/tags-selector'
import { IconTag, IconStar } from '@tabler/icons-react'
import type { Tag } from '@/hooks/useFileUpload'

// Predefined travel tags organized by category
const TRAVEL_CATEGORIES = {
  seasons: [
    { id: '1', label: '#estate' },
    { id: '2', label: '#inverno' },
    { id: '3', label: '#primavera' },
    { id: '4', label: '#autunno' }
  ],
  destinations: [
    { id: '5', label: '#mare' },
    { id: '6', label: '#montagna' },
    { id: '7', label: '#città' },
    { id: '8', label: '#natura' }
  ],
  experiences: [
    { id: '9', label: '#viaggio' },
    { id: '10', label: '#vacanza' },
    { id: '11', label: '#avventura' },
    { id: '12', label: '#relax' },
    { id: '13', label: '#cultura' }
  ],
  people: [
    { id: '14', label: '#famiglia' },
    { id: '15', label: '#amici' },
    { id: '16', label: '#coppia' }
  ],
  moments: [
    { id: '17', label: '#tramonto' },
    { id: '18', label: '#alba' },
    { id: '19', label: '#panorama' },
    { id: '20', label: '#food' }
  ]
}

const PREDEFINED_TAGS: Tag[] = [
  ...TRAVEL_CATEGORIES.seasons,
  ...TRAVEL_CATEGORIES.destinations,
  ...TRAVEL_CATEGORIES.experiences,
  ...TRAVEL_CATEGORIES.people,
  ...TRAVEL_CATEGORIES.moments
]

interface TagsSectionProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
}

export const TagsSection = memo(function TagsSection({ selectedTags, onTagsChange }: TagsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <IconTag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        <div>
          <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300">
            Tag per le tue foto
          </label>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Aggiungi tag per organizzare e ritrovare facilmente le tue foto
          </p>
        </div>
      </div>

      {/* Tags Selector */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
        <TagsSelector
          tags={PREDEFINED_TAGS}
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          placeholder="Seleziona dei tag per organizzare le tue foto"
        />
      </div>
    </div>
  )
}) 