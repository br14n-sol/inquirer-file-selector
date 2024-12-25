import type { Theme } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'

import type { SelectionType } from '#types/common'
import type { FileStats } from '#types/file'
import type { CustomTheme } from '#types/theme'

export interface FileSelectorConfig {
  message: string
  /**
   * The path to the directory where it will be started.
   * @default process.cwd()
   */
  basePath?: string
  /**
   * The type of elements that are valid selection options.
   * @default 'file'
   */
  type?: SelectionType
  /**
   * The maximum number of items to display in the list.
   * @default 10
   */
  pageSize?: number
  /**
   * If `true`, the list will loop from the last item to the first item and vice versa.
   * @default false
   */
  loop?: boolean
  /**
   * A function to filter files and directories. It returns `true` to include the file or directory in the list,
   * and `false` to exclude it.
   *
   * If not provided, all files and directories will be included by default.
   */
  filter?: (file: FileStats) => boolean
  /**
   * If `true`, the list will include files and directories that are excluded by the `filter` function.
   * @default false
   */
  showExcluded?: boolean
  /**
   * The label to display when a file is disabled.
   * @default ' (not allowed)'
   */
  disabledLabel?: string
  /**
   * If true, the prompt will allow the user to cancel the selection.
   * @default false
   */
  allowCancel?: boolean
  /**
   * The message to display when the user cancels the selection.
   * @default 'Canceled.'
   */
  cancelText?: string
  /**
   * The message that will be displayed when the directory is empty.
   * @default 'Directory is empty.'
   */
  emptyText?: string
  /**
   * The theme to use for the file selector.
   */
  theme?: PartialDeep<Theme<CustomTheme>>
}
