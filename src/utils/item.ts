import type { Stats } from 'node:fs'
import { ItemKind } from '#enums/item'
import type { Item, ItemKindType } from '#types/item'

function getItemKind(stats: Stats): ItemKindType {
  if (stats.isDirectory()) return ItemKind.Directory
  if (stats.isFile()) return ItemKind.File
  if (stats.isSymbolicLink()) return ItemKind.SymbolicLink
  return ItemKind.Unknown
}

export function toItem(name: string, path: string, stats: Stats): Item {
  return {
    name,
    path,
    kind: getItemKind(stats),
    size: stats.size,
    createdAt: stats.birthtimeMs,
    modifiedAt: stats.mtimeMs,
    isDisabled: false
  }
}

export function sortItems(items: Item[]): Item[] {
  return items.sort((a, b) => {
    // TODO: Change sort order to:
    //       1. Disabled items are placed at the end.
    //       2. By item kind:
    //          1. Directoy
    //          2. SymbolicLink
    //          3. File
    //          4. Unknown

    // Prioritize based on attributes (isDisabled and isDirectory)
    const aPriority =
      (a.isDisabled ? 2 : 0) + (a.kind === ItemKind.Directory ? -1 : 0)
    const bPriority =
      (b.isDisabled ? 2 : 0) + (b.kind === ItemKind.Directory ? -1 : 0)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // If priorities are equal, sort by name
    return a.name.localeCompare(b.name)
  })
}
