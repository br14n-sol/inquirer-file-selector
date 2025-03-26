import { readdirSync, statSync } from 'node:fs'
import { basename, join, sep } from 'node:path'
import type { Item } from '#types/item'

/**
 * Ensures that the given path ends with a separator (e.g., '/' or '\\'),
 * depending on the platform.
 */
export function ensurePathSeparator(path: string): string {
  return path.endsWith(sep) ? path : `${path}${sep}`
}

/**
 * Creates a `FileStats` object from a file path.
 */
export function createItemFromPath(path: string): Item {
  const stats = statSync(path)
  const name = basename(path)

  return Object.assign(stats, {
    name,
    path,
    isDisabled: false
  })
}

/**
 * Get files of a directory.
 */
export function getDirItems(path: string): Item[] {
  return readdirSync(path).map(fileName => {
    const filePath = join(path, fileName)
    return createItemFromPath(filePath)
  })
}

/**
 * Sorts an array of `FileStats` objects.
 *
 * Sorting is done in the following order:
 * 1. Disabled files are placed at the end.
 * 2. Directories are placed before files.
 *
 * If two items have the same priority (e.g., both are files, both are directories, or both are disabled),
 * the items are sorted alphabetically by name.
 */
export function sortItems(items: Item[]): Item[] {
  return items.sort((a, b) => {
    // Prioritize based on attributes (isDisabled and isDirectory)
    const aPriority = (a.isDisabled ? 2 : 0) + (a.isDirectory() ? -1 : 0)
    const bPriority = (b.isDisabled ? 2 : 0) + (b.isDirectory() ? -1 : 0)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // If priorities are equal, sort by name
    return a.name.localeCompare(b.name)
  })
}
