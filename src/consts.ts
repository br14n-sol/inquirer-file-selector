/** ANSI escape code to hide the cursor. */
export const ANSI_HIDE_CURSOR = '\x1B[?25l'

/** Possible prompt statuses. */
export const Status = {
  Idle: 'idle',
  Done: 'done',
  Canceled: 'canceled'
} as const
