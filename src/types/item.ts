import type { Stats } from 'node:fs'

export type Item = Stats & {
  /** Item name. */
  name: string
  /** Full path. */
  path: string
  /**
   * Indicates if the item is disabled.
   * - `false`: Visible in the list.
   * - `true`: Hidden unless `showExcluded` is `true`.
   *
   * Set to `true` if `config.filter` returns `false`.
   */
  isDisabled: boolean
}
