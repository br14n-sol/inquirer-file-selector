import fs from 'node:fs/promises'
import path from 'node:path'

import type { Result } from '#types/common'
import type { FileStats } from '#types/file'

/**
 * Ensures that the given path ends with a separator (e.g., '/' or '\\'),
 * depending on the platform.
 */
export function ensurePathSeparator(dirPath: string): string {
  return dirPath.endsWith(path.sep) ? dirPath : `${dirPath}${path.sep}`
}

export async function listDirFiles(
  dirPath: string
): Promise<Result<string[], NodeJS.ErrnoException>> {
  return fs
    .readdir(dirPath)
    .then(nameList => ({ data: nameList, error: null }))
    .catch(error => ({ data: null, error }))
}

export async function getFileInfo(
  filePath: string
): Promise<Result<Awaited<ReturnType<typeof fs.stat>>, NodeJS.ErrnoException>> {
  return fs
    .stat(filePath)
    .then(fileInfo => ({ data: fileInfo, error: null }))
    .catch(error => ({ data: null, error }))
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
