import type { ItemType } from '#consts'

export type Item = {
  name: string
  path: string
  /** Size in bytes. */
  size: number
  /** Creation timestamp (milliseconds since POSIX Epoch). */
  createdMs: number
  /** Last modification timestamp (milliseconds since POSIX Epoch). */
  lastModifiedMs: number
  isDirectory: boolean
}

export type RawItem = Item & {
  displayName: string
  isDisabled: boolean
  isCwd: boolean
  isSelected: boolean
}

/** Type representing the types of items available. */
export type ItemTypeUnion = (typeof ItemType)[keyof typeof ItemType]
