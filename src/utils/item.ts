import { readdir, stat } from 'node:fs/promises'
import { basename, join, sep } from 'node:path'
import { ItemType } from '#consts'
import type { Item, ItemTypeUnion, RawItem } from '#types/item'

/** Appends the system-specific path separator to the end of the path if missing. */
export function ensurePathSeparator(path: string): string {
  return path.endsWith(sep) ? path : `${path}${sep}`
}

/** Creates a `RawItem` from a given filesystem path. */
export async function createRawItem(path: string): Promise<RawItem> {
  const stats = await stat(path)
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
    isDirectory,
    isCwd: false,
    isSelected: false
  }
}

/** Reads all entries in the directory and returns them as `RawItem[]`. */
export async function readRawItems(path: string): Promise<RawItem[]> {
  const dirContents = await readdir(path)
  const items = await Promise.all(
    dirContents.map(async fileName => {
      const filePath = join(path, fileName)

      // Attempt to create a `RawItem` for each file.
      // If it fails (e.g., due to permissions), return `null`.
      return createRawItem(filePath).catch(() => null)
    })
  )

  return items.filter(item => item !== null)
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

/** Removes internal-only properties from a `RawItem`. */
export function stripInternalProps(raw: RawItem): Item {
  const { displayName, isDisabled, isCwd, isSelected, ...item } = raw
  return item
}

/** Checks if the item matches the expected type. */
export function isValidItemType(item: RawItem, type?: ItemTypeUnion): boolean {
  return (
    !type ||
    (type === ItemType.File && !item.isDirectory) ||
    (type === ItemType.Directory && item.isDirectory)
  )
}
