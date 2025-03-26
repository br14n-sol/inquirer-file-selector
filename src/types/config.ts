import type { Theme } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'
import type { Item } from '#types/item'
import type { PromptTheme } from '#types/theme'

export interface PromptConfig {
  /**
   * Main message displayed in the prompt.
   * @example 'Select a file:'
   */
  message: string
  /**
   * Path to the directory where the selection starts.
   * @default process.cwd()
   */
  basePath?: string
  /**
   * Type of items that are valid choices.
   *
   * If not provided, all items are valid choices.
   */
  type?: 'file' | 'directory'
  /**
   * Maximum number of items to display in the list at the same time.
   * @default 10
   */
  pageSize?: number
  /**
   * If `true`, the list moves from the last item to the first and vice versa.
   * @default false
   */
  loop?: boolean
  /**
   * Function to filter items.
   * Returns `true` to include an item in the list, and `false` to exclude it.
   *
   * If not provided, all items are included by default.
   */
  filter?: (item: Item) => boolean
  /**
   * If `true`, excluded items (by the `filter` function) are shown in the list.
   * @default false
   */
  showExcluded?: boolean
  /**
   * If `true`, allows the user to cancel the selection.
   * @default false
   */
  allowCancel?: boolean
  /**
   * Message displayed when the user cancels the selection.
   * @default 'Canceled.'
   */
  cancelText?: string
  /**
   * Message displayed if the directory is empty.
   * @default 'Directory is empty.'
   */
  emptyText?: string
  /**
   * Theme applied to the file selector.
   */
  theme?: PartialDeep<Theme<PromptTheme>>
}
