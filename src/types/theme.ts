import type { StatusType } from '#types/common'
import type { Item } from '#types/item'

export type RenderContext = {
  /**
   * List of items to render.
   */
  items: Item[]
  /**
   * Index of the item in the list.
   */
  index: number
  /**
   * Whether the item is currently active.
   */
  isActive: boolean
  /**
   * List is displayed in loop mode.
   */
  loop: boolean
}

export interface PromptTheme {
  prefix: {
    /**
     * Prefix displayed when the prompt is idle.
     * @default chalk.cyan('?')
     */
    idle: string
    /**
     * Prefix displayed when the prompt is done.
     * @default chalk.green(figures.tick)
     */
    done: string
    /**
     * Prefix displayed when the prompt is canceled.
     * @default chalk.red(figures.cross)
     */
    canceled: string
  }
  style: {
    /**
     * Style for disabled items.
     * @default chalk.strikethrough.dim
     */
    disabled: (linePrefix: string, text: string) => string
    /**
     * Style for the currently active item.
     * @default chalk.cyan
     */
    active: (text: string) => string
    /**
     * Style for the cancel text.
     * @default chalk.red
     */
    cancelText: (text: string) => string
    /**
     * Style for empty text.
     * @default chalk.red
     */
    emptyText: (text: string) => string
    /**
     * Style for items of type `'directory'`.
     * @default chalk.yellow
     */
    directory: (text: string) => string
    /**
     * Style for items of type `'file'`.
     * @default chalk.white
     */
    file: (text: string) => string
    /**
     * Style for the current directory header.
     * @default chalk.magenta
     */
    currentDir: (text: string) => string
    /**
     * Style applied to the main message, defined in `config.message`.
     * @default chalk.bold
     */
    message: (text: string, status: StatusType) => string
    /**
     * Style for the key binding help section.
     * @default chalk.italic.dim
     */
    help: (text: string) => string
    /**
     * Style for key labels in the help section.
     * @default chalk.cyan
     */
    key: (text: string) => string
  }
  hierarchySymbols: {
    /**
     * Symbol representing branches in the tree hierarchy.
     * @default '├─'
     */
    branch: string
    /**
     * Symbol representing leaves, marking the end of the tree hierarchy.
     * @default '└─'
     */
    leaf: string
  }
  help: {
    /**
     * Help message displayed at the top of the prompt.
     * @param allowCancel - Whether the prompt allows canceling the selection.
     */
    top: (allowCancel: boolean) => string
    /**
     * Help message displayed for directories.
     * @param isRoot - Whether the directory is the root directory.
     */
    directory: (isRoot: boolean) => string
    /**
     * Help message displayed for files.
     */
    file: string
  }
  /**
   * Function to render an item in the list.
   * @param item - The item to render.
   * @param context - Context information about the item.
   * @returns The rendered item as a string.
   */
  renderItem: (item: Item, context: RenderContext) => string
}
