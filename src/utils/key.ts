import {
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isSpaceKey,
  isUpKey
} from '@inquirer/core'
import type { KeypressEvent } from '@inquirer/core'

/** Check if the given key is the Escape key. */
export function isEscapeKey(key: KeypressEvent): boolean {
  return key.name === 'escape'
}

// This re-export exists only to keep the related functions in the same file.
export { isBackspaceKey, isDownKey, isEnterKey, isSpaceKey, isUpKey }
