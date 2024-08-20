import type { Theme } from '@inquirer/core'
import type { PartialDeep } from '@inquirer/type'

export type FileSelectorTheme = {
  icon: {
    /**
     * The prefix to use for the line.
     * @default isLast => isLast ? └── : ├──
     */
    linePrefix: (isLast: boolean) => string
  }
  style: {
    /**
     * The style to use for the disabled items.
     * @default chalk.dim
     */
    disabled: (text: string) => string
    /**
     * The style to use for the active item.
     * @default chalk.cyan
     */
    active: (text: string) => string
    /**
     * The style to use for the cancel text.
     * @default chalk.red
     */
    cancelText: (text: string) => string
    /**
     * Alias for `emptyText`.
     * @deprecated Use `emptyText` instead. Will be removed in the next major version.
     */
    noFilesFound?: (text: string) => string
    /**
     * The style to use for the empty text.
     * @default chalk.red
     */
    emptyText: (text: string) => string
    /**
     * The style to use for items of type directory.
     * @default chalk.yellow
     */
    directory: (text: string) => string
    /**
     * The style to use for items of type file.
     * @default chalk.white
     */
    file: (text: string) => string
    /**
     * The style to use for the current directory header.
     * @default chalk.magenta
     */
    currentDir: (text: string) => string
    /**
     * The style to use for the key bindings help.
     * @default chalk.white
     */
    help: (text: string) => string
    /**
     * The style to use for the keys in the key bindings help.
     * @default chalk.cyan
     */
    key: (text: string) => string
  }
}

export type Item = {
  /**
   * The name of the item.
   */
  name: string
  /**
   * The path to the item.
   */
  path: string
  /**
   * If the item is a directory.
   */
  isDir: boolean
  /**
   * If the item is disabled, it will be displayed in the list with the `disabledLabel` property.
   *
   * Set to `true` if the `match` function returns `false`.
   */
  isDisabled?: boolean
}

export type FileSelectorConfig = {
  message: string
  /**
   * Alias for `basePath`.
   * @deprecated Use `basePath` instead. Will be removed in the next major version.
   */
  path?: string
  /**
   * The path to the directory where it will be started.
   * @default process.cwd()
   */
  basePath?: string
  /**
   * The maximum number of items to display in the list.
   * @default 10
   */
  pageSize?: number
  /**
   * The function to use to filter the files. Returns `true` to include the file in the list.
   *
   * If not provided, all files will be included.
   */
  match?: (file: Item) => boolean
  /**
   * If true, the list will be filtered to show only files that match the `match` function.
   * @default false
   */
  hideNonMatch?: boolean
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
   * Alias for `cancelText`.
   * @deprecated Use `cancelText` instead. Will be removed in the next major version.
   */
  canceledLabel?: string
  /**
   * The message to display when the user cancels the selection.
   * @default 'Canceled.'
   */
  cancelText?: string
  /**
   * Alias for `emptyText`.
   * @deprecated Use `emptyText` instead. Will be removed in the next major version.
   */
  noFilesFound?: string
  /**
   * The message that will be displayed when the directory is empty.
   * @default 'Directory is empty.'
   */
  emptyText?: string
  /**
   * The theme to use for the file selector.
   */
  theme?: PartialDeep<Theme<FileSelectorTheme>>
}
