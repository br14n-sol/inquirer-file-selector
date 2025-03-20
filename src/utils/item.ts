import type { Stats } from 'node:fs'
import { basename } from 'node:path'
import { ItemKind } from '#enums/item'
import type { Result } from '#types/common'
import type { Item, ItemKindType } from '#types/item'
import { ensurePathSeparator, getFileStat } from '#utils/file'

function getItemKind(stats: Stats): ItemKindType {
  if (stats.isDirectory()) return ItemKind.Directory
  if (stats.isFile()) return ItemKind.File
  return ItemKind.Unknown
}

function createItem(path: string, stats: Stats): Item {
  const name = basename(path)
  const kind = getItemKind(stats)

  // TODO: I don't remember why i added this property to the Item type (?)
  const displayName =
    kind === ItemKind.Directory ? ensurePathSeparator(name) : name

  return {
    displayName,
    name,
    path,
    kind,
    size: stats.size,
    createdAt: stats.birthtimeMs,
    modifiedAt: stats.mtimeMs,
    isDisabled: false
  }
}

export async function getItemStat(
  path: string
): Promise<Result<Item, NodeJS.ErrnoException>> {
  const { data: stats, error } = await getFileStat(path)

  if (error) return { data: null, error }

  const item = createItem(path, stats)

  return { data: item, error: null }
}

export function sortItems(items: Item[]): Item[] {
  const kindOrder: Record<ItemKindType, number> = {
    [ItemKind.Directory]: 1,
    [ItemKind.File]: 2,
    [ItemKind.Unknown]: 3
  }

  return items.toSorted((a, b) => {
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
