import type { KeypressEvent } from '@inquirer/core'
import type { Keybinds } from '#types/config'

/** Method names for action checks. */
export type ActionCheckMethodName = `is${Capitalize<keyof Keybinds>}`

/** Function type for action checks. */
export type ActionCheckFn = (e: KeypressEvent) => boolean
