import type { Theme } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'
import type { Item } from '#types/item'
import type { PromptTheme } from '#types/theme'

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
  type?: 'file' | 'directory'
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
   * Message when selection is canceled.
   * @default 'Canceled.'
   */
  cancelText?: string
  /**
   * Message when the directory is empty.
   * @default 'Directory is empty.'
   */
  emptyText?: string
  /** Theme applied to the file selector. */
  theme?: PartialDeep<Theme<PromptTheme>>
}
