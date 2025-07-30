import type { KeypressEvent } from '@inquirer/core'
import { defaultKeybinds } from '#consts.js'

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
