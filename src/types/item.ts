import type { ItemKind } from '#enums/item'

export type ItemKindType = (typeof ItemKind)[keyof typeof ItemKind]

export type Item = {
  displayName: string
  name: string
  path: string
  kind: ItemKindType
  size: number
  createdAt: number
  modifiedAt: number
  isDisabled: boolean
}
