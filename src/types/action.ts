export type ActionName =
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
  hint: string
}
