import type { StatusType } from '#types/common'
import type { FileStats } from '#types/file'

export type RenderContext = {
  /**
   * List of items to render.
   */
  items: FileStats[]
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

export interface CustomTheme {
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
     * @default chalk.dim
     */
    disabled: (text: string) => string
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
     * @default chalk.white
     */
    help: (text: string) => string
    /**
     * Style for key labels in the help section.
     * @default chalk.cyan
     */
    key: (text: string) => string
  }
  labels: {
    /**
     * Label displayed next to an item when it is disabled.
     * @default '(not allowed)'
     */
    disabled: string
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
  /**
   * Function to render an item in the list.
   * @param item - The item to render.
   * @param context - Context information about the item.
   * @returns The rendered item as a string.
   */
  renderItem: (item: FileStats, context: RenderContext) => string
}
