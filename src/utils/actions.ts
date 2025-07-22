import type { KeypressEvent } from '@inquirer/core'
import { Actions } from '#consts.js'

export function isUp(key: KeypressEvent): boolean {
  return Actions.Up.some(k => k === key.name)
}

export function isDown(key: KeypressEvent): boolean {
  return Actions.Down.some(k => k === key.name)
}

export function isBack(key: KeypressEvent): boolean {
  return Actions.Back.some(k => k === key.name)
}

export function isForward(key: KeypressEvent): boolean {
  return Actions.Forward.some(k => k === key.name)
}

export function isToggle(key: KeypressEvent): boolean {
  return Actions.Toggle.some(k => k === key.name)
}

export function isConfirm(key: KeypressEvent): boolean {
  return Actions.Confirm.some(k => k === key.name)
}

export function isCancel(key: KeypressEvent): boolean {
  return Actions.Cancel.some(k => k === key.name)
}
