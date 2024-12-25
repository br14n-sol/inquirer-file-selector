import type { Stats } from 'node:fs'

export type FileStats = Stats & {
  /**
   * The name of the file or directory.
   */
  name: string
  /**
   * The path to the file or directory.
   */
  path: string
  /**
   * If the file or directory is disabled, it will be displayed in the list with the `disabledLabel` property.
   *
   * Set to `true` if the `filter` function returns `false`.
   */
  isDisabled: boolean
}
