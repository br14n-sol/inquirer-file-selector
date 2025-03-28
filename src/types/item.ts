import type { ItemKind } from '#enums/item'

export type ItemKindType = (typeof ItemKind)[keyof typeof ItemKind]

export type Item = {
  displayName: string
  /** Item name. */
  name: string
  /** Full path. */
  path: string
  kind: ItemKindType
  size: number
  createdAt: number
  modifiedAt: number
  isBase: boolean
  /**
   * Indicates if the item is disabled.
   * - `false`: Visible in the list.
   * - `true`: Hidden unless `showExcluded` is `true`.
   *
   * Set to `true` if `config.filter` returns `false`.
   */
  isDisabled: boolean
}
