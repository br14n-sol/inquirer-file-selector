import fs from 'node:fs'
import type { KeypressEvent } from '@inquirer/core'

import type { Choice } from './types.js'

/**
 * ANSI escape code to hide the cursor
 */
export const CURSOR_HIDE = '\x1B[?25l'

/**
 * Check if the given key is the escape key
 */
export function isEscapeKey(key: KeypressEvent): boolean {
  return key.name === 'escape'
}

/**
 * Get content of a directory
 */
export function getDirContents(dir: string): Choice[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .map(dirent => ({
      value: dirent.name,
      path: path.join(dirent.parentPath, dirent.name),
      isDir: dirent.isDirectory()
    }))
    .sort((a, b) => {
      if (a.isDir && !b.isDir) {
        return -1 // a is dir, should come first
      }

      if (!a.isDir && b.isDir) {
        return 1 // b is dir, should come first
      }

      // both are files or both are dirs - sort by name
      return a.value.localeCompare(b.value)
    })
}
