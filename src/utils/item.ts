import type { Stats } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { basename, join, sep } from 'node:path'
import type { Item } from '#types/item'

function isErrorWithCode(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}

function getErrorMessage(path: string, code?: string) {
  switch (code) {
    case 'ENOENT':
      return `File or directory not found (${code}): '${path}'`
    case 'EACCES':
      return `Permission denied (${code}): Cannot access '${path}'`
    case 'EPERM':
      return `Operation not permitted (${code}): '${path}'`
    default:
      return `Unexpected error (${code}): Cannot access '${path}'`
  }
}

/** Ensures the path ends with a separator (`/` or `\`). */
export function ensurePathSeparator(path: string): string {
  return path.endsWith(sep) ? path : `${path}${sep}`
}

function createItem(path: string, stats: Stats): Item {
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

/** Creates an `Item' object from a file path. */
export async function createItemFromPath(path: string): Promise<Item> {
  try {
    const stats = await stat(path)
    return createItem(path, stats)
  } catch (error) {
    throw new Error(
      getErrorMessage(path, isErrorWithCode(error) ? error.code : undefined),
      { cause: error }
    )
  }
}

/** Get items from a directory. */
export async function listDirectoryItems(path: string): Promise<Item[]> {
  try {
    const fileNames = await readdir(path)
    const itemList: Item[] = []

    for (const fileName of fileNames) {
      const filePath = join(path, fileName)

      try {
        const item = await createItemFromPath(filePath)
        itemList.push(item)
      } catch (error) {
        // TODO: Think about how to send this error to the prompt without breaking the loop
        console.error(error)
      }
    }

    return itemList
  } catch (error) {
    throw new Error(
      getErrorMessage(path, isErrorWithCode(error) ? error.code : undefined),
      { cause: error }
    )
  }
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

    return a.displayName.localeCompare(b.displayName)
  })
}
