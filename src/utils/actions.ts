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
