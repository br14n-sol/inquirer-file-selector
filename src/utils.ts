import fs from 'node:fs'
import path from 'node:path'
import type { KeypressEvent } from '@inquirer/core'

import type { Item } from './types.js'

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
 * Add a trailing slash at the end of the given path if it doesn't already have one
 */
export function ensureTrailingSlash(dir: string): string {
  return dir.endsWith(path.sep) ? dir : `${dir}${path.sep}`
}

/**
 * Strip ANSI codes from the given string
 */
export function stripAnsiCodes(str: string): string {
  return str.replace(/\x1B\[\d+m/g, '')
}

/**
 * Get the maximum length of the given array of strings
 */
export function getMaxLength(arr: string[]): number {
  return arr.reduce(
    (max, item) => Math.max(max, stripAnsiCodes(item).length),
    0
  )
}

/**
 * Get content of a directory
 */
export function getDirContents(dir: string): Item[] {
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
