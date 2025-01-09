/**
 * ANSI escape code to hide the cursor.
 */
export const ANSI_HIDE_CURSOR = '\x1B[?25l'

/**
 * Strip ANSI escape codes from a string.
 */
export function stripAnsiEscapeCodes(str: string): string {
  return str.replace(/\x1B\[\d+m/g, '')
}

/**
 * Computes the maximum length of the given strings after stripping ANSI escape codes.
 */
export function getMaxLength(arr: string[]): number {
  return arr.reduce(
    (maxLength, str) => Math.max(maxLength, stripAnsiEscapeCodes(str).length),
    0
  )
}
