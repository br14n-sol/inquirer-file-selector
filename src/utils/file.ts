import fs from 'node:fs'
import path from 'node:path'

import type { FileStats } from '#types/file'

/**
 * Ensures that the given path ends with a separator (e.g., '/' or '\\'),
 * depending on the platform.
 */
export function ensurePathSeparator(dirPath: string): string {
  return dirPath.endsWith(path.sep) ? dirPath : `${dirPath}${path.sep}`
}

/**
 * Creates a `FileStats` object from a file path.
 */
export function createFileStats(filepath: string): FileStats {
  const fileStat = fs.statSync(filepath)
  const filename = path.basename(filepath)

  return Object.assign(fileStat, {
    name: filename,
    path: filepath,
    isDisabled: false
  })
}

/**
 * Get files of a directory.
 */
export function getDirFiles(dirPath: string): FileStats[] {
  return fs.readdirSync(dirPath).map(filename => {
    const filepath = path.join(dirPath, filename)
    return createFileStats(filepath)
  })
}

/**
 * Sorts an array of `FileStats` objects.
 *
 * Sorting is done in the following order:
 * 1. Disabled files are placed at the end.
 * 2. Directories are placed before files.
 *
 * If two items have the same priority (e.g., both are files, both are directories, or both are disabled),
 * the items are sorted alphabetically by name.
 */
export function sortFiles(files: FileStats[]): FileStats[] {
  return files.sort((a, b) => {
    // Prioritize based on attributes (isDisabled and isDirectory)
    const aPriority = (a.isDisabled ? 2 : 0) + (a.isDirectory() ? -1 : 0)
    const bPriority = (b.isDisabled ? 2 : 0) + (b.isDirectory() ? -1 : 0)

    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }

    // If priorities are equal, sort by name
    return a.name.localeCompare(b.name)
  })
}
