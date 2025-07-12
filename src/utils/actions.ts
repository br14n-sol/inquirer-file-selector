import type { KeypressEvent } from '@inquirer/core'
import { Actions } from '#consts.js'

export function isUp(key: KeypressEvent): boolean {
  return Actions.Up.keys.includes(key.name)
}

export function isDown(key: KeypressEvent): boolean {
  return Actions.Down.keys.includes(key.name)
}

export function isBack(key: KeypressEvent): boolean {
  return Actions.Back.keys.includes(key.name)
}

export function isForward(key: KeypressEvent): boolean {
  return Actions.Forward.keys.includes(key.name)
}

export function isToggle(key: KeypressEvent): boolean {
  return Actions.Toggle.keys.includes(key.name)
}

export function isConfirm(key: KeypressEvent): boolean {
  return Actions.Confirm.keys.includes(key.name)
}

export function isCancel(key: KeypressEvent): boolean {
  return Actions.Cancel.keys.includes(key.name)
}
