import { stripVTControlCharacters } from 'node:util'

/**
 * ANSI escape code to hide the cursor.
 */
export const ANSI_HIDE_CURSOR = '\x1B[?25l'

/**
 * Computes the maximum length of the given strings after stripping ANSI escape codes.
 */
export function getMaxLength(arr: string[]): number {
  return arr.reduce(
    (maxLength, str) =>
      Math.max(maxLength, stripVTControlCharacters(str).length),
    0
  )
}
