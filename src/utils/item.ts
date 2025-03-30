import { readdirSync, statSync } from 'node:fs'
import { basename, join, sep } from 'node:path'
import type { Item } from '#types/item'

/** Ensures the path ends with a separator (`/` or `\`). */
export function ensurePathSeparator(path: string): string {
  return path.endsWith(sep) ? path : `${path}${sep}`
}

/** Creates an `Item' object from a file path. */
export function createItemFromPath(path: string): Item {
  const stats = statSync(path)
  const name = basename(path)
  const isDirectory = stats.isDirectory()
  const displayName = isDirectory ? ensurePathSeparator(name) : name

  return {
    displayName,
    name,
    path,
    size: stats.size,
    createdMs: stats.birthtimeMs,
    lastModifiedMs: stats.mtimeMs,
    isDisabled: false,
    isDirectory
  }
}

/** Get items from a directory. */
export function getDirItems(path: string): Item[] {
  return readdirSync(path).map(fileName => {
    const filePath = join(path, fileName)
    return createItemFromPath(filePath)
  })
}

/**
 * Sort an array of `Item` objects by the following criteria:
 * 1. Disabled items are placed at the end.
 * 2. Directories are placed before files.
 * 3. Alphabetically if the priorities match.
 */
export function sortItems(items: Item[]): Item[] {
  return items.sort((a, b) => {
    const aPriority = (a.isDisabled ? 2 : 0) + (a.isDirectory ? -1 : 0)
    const bPriority = (b.isDisabled ? 2 : 0) + (b.isDirectory ? -1 : 0)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    return a.name.localeCompare(b.name)
  })
}
