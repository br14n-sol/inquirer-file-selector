import { readdirSync, statSync } from 'node:fs'
import { basename, join, sep } from 'node:path'
import type { Item, RawItem } from '#types/item'

/** Appends the system-specific path separator to the end of the path if missing. */
export function ensurePathSeparator(path: string): string {
  return path.endsWith(sep) ? path : `${path}${sep}`
}

/** Creates a `RawItem` from a given filesystem path. */
export function createRawItem(path: string): RawItem {
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

/** Reads all entries in the directory and returns them as `RawItem[]`. */
export function readRawItems(path: string): RawItem[] {
  return readdirSync(path)
    .map(fileName => {
      const filePath = join(path, fileName)
      try {
        return createRawItem(filePath)
      } catch {
        // Skip missing or inaccessible files/directories
        return null
      }
    })
    .filter((item): item is RawItem => item !== null)
}

/**
 * Sorts the given array of `RawItem`s by the following criteria:
 * 1. Enabled items before disabled ones.
 * 2. Directories before files.
 * 3. Alphabetical order (by name) if priorities match.
 *
 * Mutates the original array.
 */
export function sortRawItems(items: RawItem[]): void {
  items.sort((a, b) => {
    const aPriority = (a.isDisabled ? 2 : 0) + (a.isDirectory ? -1 : 0)
    const bPriority = (b.isDisabled ? 2 : 0) + (b.isDirectory ? -1 : 0)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    return a.name.localeCompare(b.name)
  })
}

/** Removes internal-only properties (`displayName` and `isDisabled`) from a `RawItem`. */
export function stripInternalProps(raw: RawItem): Item {
  const { displayName, isDisabled, ...item } = raw
  return item
}
