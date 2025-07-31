import type { Theme } from '@inquirer/core'
import type { PartialDeep, Prettify } from '@inquirer/type'
import type { defaultKeybinds } from '#consts'
import type { Item, ItemTypeUnion } from '#types/item'
import type { PromptTheme } from '#types/theme'

/** Keybinds type based on the default keybinds. */
export type Keybinds = typeof defaultKeybinds

export interface PromptConfig {
  /** Main message displayed in the prompt. */
  message: string
  /**
   * Initial directory.
   * @default process.cwd()
   */
  basePath?: string
  /**
   * Allowed item type.
   * If omitted, all items are valid.
   */
  type?: ItemTypeUnion
  /**
   * Indicates if multiple items can be selected.
   * @default false
   */
  multiple?: boolean
  /**
   * Max items displayed at once.
   * @default 10
   */
  pageSize?: number
  /**
   * Indicates if navigation is looped from the last to the first element.
   * @default false
   */
  loop?: boolean
  /**
   * Filters items in the list.
   * @param item - Item to evaluate.
   */
  filter?: (item: Readonly<Item>) => boolean
  /**
   * Indicates if items excluded by `filter` are visible.
   * @default false
   */
  showExcluded?: boolean
  /**
   * Indicates if canceling is allowed.
   * @default false
   */
  allowCancel?: boolean
  /**
   * Keybinds for actions.
   * If omitted, default keybinds are used.
   */
  keybinds?: Prettify<Partial<Keybinds>>
  /** Theme applied to the file selector. */
  theme?: PartialDeep<Theme<PromptTheme>>
}
