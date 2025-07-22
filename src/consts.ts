/** ANSI escape code to hide the cursor. */
export const ANSI_HIDE_CURSOR = '\x1B[?25l'

/** Possible prompt statuses. */
export const Status = {
  Idle: 'idle',
  Done: 'done',
  Canceled: 'canceled'
} as const

/**
 * Actions that can be performed in the prompt.
 * Each action corresponds to a map of key names.
 *
 * TODO: Put this in the config directly in a different pull request. See #68
 */
export const Actions = {
  Up: ['up', 'w'],
  Down: ['down', 's'],
  Back: ['left', 'a'],
  Forward: ['right', 'd'],
  Toggle: ['space'],
  Confirm: ['enter', 'return'],
  Cancel: ['escape']
} as const
