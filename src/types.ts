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
     * The style to use for the no files found message.
     * @default chalk.red
     */
    noFilesFound: (text: string) => string
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
   * The value of the item.
   */
  value: string
  /**
   * The path to the item.
   */
  path: string
  /**
   * If the item is a directory.
   */
  isDir: boolean
  /**
   * If the item is disabled. Used when a list of extensions is provided.
   */
  disabled?: boolean
}

export type FileSelectorConfig = {
  message: string
  /**
   * The path to the directory where it will be started.
   * @default process.cwd()
   */
  path?: string
  /**
   * The maximum number of items to display in the list.
   * @default 10
   */
  pageSize?: number
  /**
   * The extensions to filter the files.
   * @default []
   */
  extensions?: string[]
  /**
   * If true, the list will be filtered to only show files that match the extensions.
   * @default false
   */
  hideNonMatch?: boolean
  /**
   * The label to display when a file is disabled.
   * @default ' (not allowed)'
   */
  disabledLabel?: string
  /**
   * The message to display when no files are found.
   * @default 'No files found'
   */
  noFilesFound?: string
  /**
   * The theme to use for the file selector.
   */
  theme?: PartialDeep<Theme<FileSelectorTheme>>
}
