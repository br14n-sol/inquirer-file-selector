import type { KeypressEvent } from '@inquirer/core'
import { defaultKeybinds } from '#consts.js'
import type { ActionCheckFn, ActionCheckMethodName } from '#types/actions'
import type { Keybinds } from '#types/config'
import { capitalize } from '#utils/string'

/** Creates action key checks based on the provided keybinds. */
export function createActionChecks(
  defaultKeybinds: Keybinds,
  keybinds?: Partial<Keybinds>
): Record<ActionCheckMethodName, ActionCheckFn> {
  const mergedKeybinds = { ...defaultKeybinds, ...keybinds }
  const checks = {} as Record<ActionCheckMethodName, ActionCheckFn>

  for (const [action, keys] of Object.entries(mergedKeybinds)) {
    const methodName = `is${capitalize(action)}` as ActionCheckMethodName
    checks[methodName] = event => keys.includes(event.name)
  }

  return checks
}

export function isUp(key: KeypressEvent): boolean {
  return defaultKeybinds.up.some(k => k === key.name)
}

export function isDown(key: KeypressEvent): boolean {
  return defaultKeybinds.down.some(k => k === key.name)
}

export function isBack(key: KeypressEvent): boolean {
  return defaultKeybinds.back.some(k => k === key.name)
}

export function isForward(key: KeypressEvent): boolean {
  return defaultKeybinds.forward.some(k => k === key.name)
}

export function isToggle(key: KeypressEvent): boolean {
  return defaultKeybinds.toggle.some(k => k === key.name)
}

export function isConfirm(key: KeypressEvent): boolean {
  return defaultKeybinds.confirm.some(k => k === key.name)
}

export function isCancel(key: KeypressEvent): boolean {
  return defaultKeybinds.cancel.some(k => k === key.name)
}
