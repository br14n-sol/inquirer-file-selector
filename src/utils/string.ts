/**
 * ANSI escape code to hide the cursor
 */
export const CURSOR_HIDE = '\x1B[?25l'

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
