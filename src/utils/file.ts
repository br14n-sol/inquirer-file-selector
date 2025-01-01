import fs from 'node:fs'
import path from 'node:path'

import type { SelectionType } from '#types/common'
import type { FileStats } from '#types/file'

/**
 * Ensures that the given path ends with a separator (e.g., '/' or '\\'),
 * depending on the platform.
 */
export function ensurePathSeparator(dirPath: string): string {
  return dirPath.endsWith(path.sep) ? dirPath : `${dirPath}${path.sep}`
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
 * Sorts an array of `FileStats` objects, with the option to exclude disabled files.
 *
 * If `showExcluded` is true, all files (including disabled ones) will be included in the result.
 * If `showExcluded` is false, disabled files will be excluded from the result.
 *
 * Sorting is done with the following priorities:
 * 1. Disabled files are placed at the end.
 * 2. Directories are placed before files.
 *
 * If the priority between two items is the same (e.g., both are files, both are directories, or both are disabled),
 * the items are sorted alphabetically by name.
 */
export function sortFiles(
  files: FileStats[],
  showExcluded: boolean
): FileStats[] {
  return files
    .filter(file => showExcluded || !file.isDisabled)
    .sort((a, b) => {
      // Assign priorities based on attributes (isDisabled, isDirectory)
      const aPriority = (a.isDisabled ? 2 : 0) + (a.isDirectory() ? -1 : 0)
      const bPriority = (b.isDisabled ? 2 : 0) + (b.isDirectory() ? -1 : 0)

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // If priorities are equal, sort by name
      return a.name.localeCompare(b.name)
    })
}
