export type ActionMap =
  | 'Up'
  | 'Down'
  | 'Back'
  | 'Forward'
  | 'Toggle'
  | 'Confirm'
  | 'Cancel'

export type Action = {
  keys: string[]
  label: string
}
