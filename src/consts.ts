import figures from '@inquirer/figures'
import type { Action, ActionName } from '#types/action'

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
 * Each action has a set of keys that can trigger it and a label for display.
 */
export const Actions: Record<ActionName, Action> = {
  Up: {
    keys: ['up', 'w'],
    label: `${figures.arrowUp}/w`,
    hint: 'to navigate'
  },
  Down: {
    keys: ['down', 's'],
    label: `${figures.arrowDown}/s`,
    hint: 'to navigate'
  },
  Back: {
    keys: ['left', 'a'],
    label: `${figures.arrowLeft}/a`,
    hint: 'to go back'
  },
  Forward: {
    keys: ['right', 'd'],
    label: `${figures.arrowRight}/d`,
    hint: 'to open'
  },
  Toggle: {
    keys: ['space'],
    label: '\u2423', // ␣
    hint: 'to select'
  },
  Confirm: {
    keys: ['enter', 'return'],
    label: '\u21B5', // ↵
    hint: 'to confirm'
  },
  Cancel: {
    keys: ['escape'],
    label: 'Esc',
    hint: 'to cancel'
  }
} as const
