import fs from 'node:fs'
import path from 'node:path'
import type { KeypressEvent } from '@inquirer/core'

import { stripVTControlCharacters } from 'node:util'
import type { FileStats, SelectionType } from './types.js'

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
 * Get the maximum length of the given array of strings
 */
export function getMaxLength(arr: string[]): number {
  return arr.reduce(
    (max, item) => Math.max(max, stripVTControlCharacters(item).length),
    0
  )
}

/**
 * Get files of a directory
 */
export function getDirFiles(dir: string, type: SelectionType): FileStats[] {
  const files: string[] = fs.readdirSync(dir)

  if (type === 'directory' || type === 'file+directory') {
    files.unshift('.')
  }

  return files.map(filename => {
    const filepath = path.join(dir, filename)
    const fileStat = fs.statSync(filepath)

    return Object.assign(fileStat, {
      name: filename,
      path: filepath,
      isDisabled: false
    })
  })
}

/**
 * Sort files, optionally filtering out disabled files if `showExcluded` is `false`
 */
export function sortFiles(
  files: FileStats[],
  showExcluded: boolean
): FileStats[] {
  return files
    .sort((a, b) => {
      // a is disabled, should come last
      if (a.isDisabled && !b.isDisabled) {
        return 1
      }

      // b is disabled, should come last
      if (!a.isDisabled && b.isDisabled) {
        return -1
      }

      // a is dir, should come first
      if (a.isDirectory() && !b.isDirectory()) {
        return -1
      }

      // b is dir, should come first
      if (!a.isDirectory() && b.isDirectory()) {
        return 1
      }

      // both are files or dirs, regardless of whether they are disabled - sort by name
      return a.name.localeCompare(b.name)
    })
    .filter(file => showExcluded || !file.isDisabled)
}
