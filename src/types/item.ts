import type { Stats } from 'node:fs'

export type Item = Stats & {
  /**
   * Item name.
   */
  name: string
  /**
   * Full path to the item.
   */
  path: string
  /**
   * Indicates whether the item is disabled.
   * - `false`: Item is enabled and displayed in the list.
   * - `true`: Item is disabled and shown only if `showExcluded` is `true`.
   *
   * Disabled items are labeled with `disabledLabel` when visible.
   * This is set to `true` if `filter` function returns `false` for the item.
   */
  isDisabled: boolean
}
