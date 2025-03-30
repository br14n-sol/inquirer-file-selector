export type Item = {
  /** Display name used in the list. */
  displayName: string
  name: string
  path: string
  /** Size in bytes. */
  size: number
  /** Creation timestamp (milliseconds since POSIX Epoch). */
  createdMs: number
  /** Last modification timestamp (milliseconds since POSIX Epoch). */
  lastModifiedMs: number
  /**
   * Indicates if the item is disabled.
   * - `false`: Visible in the list.
   * - `true`: Hidden unless `showExcluded` is `true`.
   *
   * Set to `true` if `config.filter` returns `false`.
   */
  isDisabled: boolean
  isDirectory: boolean
}
