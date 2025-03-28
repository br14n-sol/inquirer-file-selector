import type { Stats } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { basename, join, sep } from 'node:path'
import { ItemKind } from '#enums/item'
import type { Item, ItemKindType } from '#types/item'

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

function getItemKind(stats: Stats): ItemKindType {
  if (stats.isDirectory()) return ItemKind.Directory
  if (stats.isFile()) return ItemKind.File
  return ItemKind.Unknown
}

function createItem(path: string, stats: Stats): Item {
  const name = basename(path)
  const kind = getItemKind(stats)
  const displayName = kind === ItemKind.Directory ? name + sep : name

  return {
    displayName,
    name,
    path,
    kind,
    size: stats.size,
    createdAt: stats.birthtimeMs,
    modifiedAt: stats.mtimeMs,
    isBase: false,
    isDisabled: false
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
  const kindOrder: Record<ItemKindType, number> = {
    [ItemKind.Directory]: 1,
    [ItemKind.File]: 2,
    [ItemKind.Unknown]: 3
  }

  return items.toSorted((a, b) => {
    // 1. Base item are placed at the beginning
    if (a.isBase !== b.isBase) {
      return a.isBase ? -1 : 1
    }

    // 1. Disabled items are placed at the end
    if (a.isDisabled !== b.isDisabled) {
      return a.isDisabled ? 1 : -1
    }

    // 2. Sort by item kind (Directory -> File -> Unknown)
    const kindComparison = kindOrder[a.kind] - kindOrder[b.kind]
    if (kindComparison !== 0) {
      return kindComparison
    }

    // 3. If all else is equal, sort by name
    return a.name.localeCompare(b.name)
  })
}
