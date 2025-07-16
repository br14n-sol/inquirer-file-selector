import figures from '@inquirer/figures'
import type { Action, ActionMap } from '#types/action'

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
export const Actions: Record<ActionMap, Action> = {
  Up: {
    keys: ['up', 'w'],
    label: `${figures.arrowUp}/w`
  },
  Down: {
    keys: ['down', 's'],
    label: `${figures.arrowDown}/s`
  },
  Back: {
    keys: ['left', 'a'],
    label: `${figures.arrowLeft}/a`
  },
  Forward: {
    keys: ['right', 'd'],
    label: `${figures.arrowRight}/d`
  },
  Toggle: {
    keys: ['space'],
    label: '\u2423' // ␣
  },
  Confirm: {
    keys: ['enter', 'return'],
    label: '\u21B5' // ↵
  },
  Cancel: {
    keys: ['escape'],
    label: 'Esc'
  }
} as const
