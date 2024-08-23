import fs from 'node:fs'
import path from 'node:path'
import type { KeypressEvent } from '@inquirer/core'

import type {ExpectOption, Item} from './types.js'

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
 * Check if the given item matches the given match function.
 */
export function matchCheck(
  item: Item,
  match?: (item: Item) => boolean
): boolean {
  return !match || match(item)
}

/**
 * Get items of a directory
 */
export function getDirItems(dir: string, expect: ExpectOption): Item[] {
    const dirItems = fs.readdirSync(dir, {withFileTypes: true}).map(dirent => ({
        name: dirent.name,
        path: path.join(dir, dirent.name),
        isDir: dirent.isDirectory()
    }))
    if (['directory', 'both'].includes(expect)) {
        const curItem = {
            name: '.',
            path: dir,
            isDir: true
        }
        return [curItem, ...dirItems];
    }
    return dirItems;
}

/**
 * Sort items, optionally filtering out disabled items if hideNonMatch is true
 */
export function sortItems(items: Item[], hideNonMatch: boolean): Item[] {
  return items
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
      if (a.isDir && !b.isDir) {
        return -1
      }

      // b is dir, should come first
      if (!a.isDir && b.isDir) {
        return 1
      }

      // both are files or dirs, regardless of whether they are disabled - sort by name
      return a.name.localeCompare(b.name)
    })
    .filter(item => !hideNonMatch || !item.isDisabled)
}
