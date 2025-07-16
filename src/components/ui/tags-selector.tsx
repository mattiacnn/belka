"use client" 

import * as React from "react"

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tag = {
  id: string;
  label: string;
};

type TagsSelectorProps = {
  tags: Tag[];
  selectedTags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
};

export function TagsSelector({ 
  tags, 
  selectedTags: controlledSelectedTags,
  onTagsChange,
  placeholder = "Seleziona i tag",
  className = ""
}: TagsSelectorProps) {
  const [internalSelectedTags, setInternalSelectedTags] = useState<Tag[]>([]);
  const selectedsContainerRef = useRef<HTMLDivElement>(null);

  // Use controlled or internal state
  const selectedTags = controlledSelectedTags ?? internalSelectedTags;
  const setSelectedTags = onTagsChange ?? setInternalSelectedTags;

  const removeSelectedTag = (id: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== id);
    setSelectedTags(newTags);
  };

  const addSelectedTag = (tag: Tag) => {
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  useEffect(() => {
    if (selectedsContainerRef.current) {
      selectedsContainerRef.current.scrollTo({
        left: selectedsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selectedTags]);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <motion.div
        className="w-full flex items-center justify-start gap-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 h-14 mb-3 overflow-x-auto p-1.5 no-scrollbar"
        style={{
          borderRadius: 12,
        }}
        ref={selectedsContainerRef}
        layout
      >
        {selectedTags.length === 0 && (
          <span className="text-neutral-400 dark:text-neutral-500 text-sm px-3">
            {placeholder}
          </span>
        )}
        {selectedTags.map((tag) => (
          <motion.div
            key={tag.id}
            className="flex items-center gap-1 pl-3 pr-1 py-1 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 h-full shrink-0"
            style={{
              borderRadius: 10,
            }}
            layoutId={`tag-${tag.id}`}
          >
            <motion.span
              layoutId={`tag-${tag.id}-label`}
              className="text-violet-700 dark:text-violet-300 font-medium text-sm"
            >
              {tag.label}
            </motion.span>
            <Button
              onClick={() => removeSelectedTag(tag.id)}
              variant="ghost"
              size="icon"
              className="p-1 h-6 w-6 hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors"
            >
              <X className="size-4 text-violet-600 dark:text-violet-400" />
            </Button>
          </motion.div>
        ))}
      </motion.div>
      {tags.length > selectedTags.length && (
        <motion.div
          className="bg-white dark:bg-neutral-800 shadow-sm p-3 border border-neutral-300 dark:border-neutral-600 w-full"
          style={{
            borderRadius: 12,
          }}
          layout
        >
          <motion.div className="flex flex-wrap gap-2">
            {tags
              .filter(
                (tag) =>
                  !selectedTags.some((selected) => selected.id === tag.id)
              )
              .map((tag) => (
                <motion.button
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="flex items-center gap-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full shrink-0 transition-colors"
                  onClick={() => addSelectedTag(tag)}
                  style={{
                    borderRadius: 10,
                  }}
                >
                  <motion.span
                    layoutId={`tag-${tag.id}-label`}
                    className="text-neutral-700 dark:text-neutral-300 font-medium text-sm"
                  >
                    {tag.label}
                  </motion.span>
                </motion.button>
              ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
