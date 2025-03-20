import type { Stats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Result } from '#types/common'

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

export async function getFileStat(
  filePath: string
): Promise<Result<Stats, NodeJS.ErrnoException>> {
  return fs
    .stat(filePath, { bigint: false })
    .then(fileInfo => ({ data: fileInfo, error: null }))
    .catch(error => ({ data: null, error }))
}
