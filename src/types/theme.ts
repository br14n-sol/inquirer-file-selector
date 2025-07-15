import type { RawItem } from '#types/item'
import type { StatusType } from '#types/status'

export type RenderContext = {
  /** Items to render. */
  items: RawItem[]
  /** Indicates if the list is displayed in loop mode. */
  loop: boolean
  /** Item index. */
  index: number
  /** Indicates if the item is active. */
  isActive: boolean
}

export interface PromptTheme {
  prefix: {
    /**
     * The prefix displayed when the prompt is idle.
     * @default chalk.cyan('?')
     */
    idle: string
    /**
     * The prefix displayed when the prompt is done.
     * @default chalk.green(figures.tick)
     */
    done: string
    /**
     * The prefix displayed when the prompt is canceled.
     * @default chalk.red(figures.cross)
     */
    canceled: string
  }
  style: {
    /**
     * Defines the style for disabled items.
     * @default chalk.strikethrough.gray
     */
    disabled: (linePrefix: string, text: string) => string
    /**
     * Defines the style for the active item.
     * @default chalk.cyan
     */
    active: (text: string) => string
    /**
     * Defines the style for the cancel text.
     * @default chalk.red
     */
    cancelText: (text: string) => string
    /**
     * Defines the style for empty text.
     * @default chalk.red
     */
    emptyText: (text: string) => string
    /**
     * Defines the style for items of type `'directory'`.
     * @default chalk.yellowBright
     */
    directory: (text: string) => string
    /**
     * Defines the style for items of type `'file'`.
     * @default No style applied
     */
    file: (text: string) => string
    /**
     * Defines the style for the current directory header.
     * @default chalk.magentaBright
     */
    currentDir: (text: string) => string
    /**
     * Defines the style applied to the main message, defined in `config.message`.
     * @default chalk.bold
     */
    message: (text: string, status: StatusType) => string
    /**
     * Defines the style for help messages.
     * @default chalk.italic.gray
     */
    help: (text: string) => string
  }
  hierarchySymbols: {
    /**
     * Symbol representing a branch in the tree hierarchy.
     * @default '├─'
     */
    branch: string
    /**
     * Symbol representing a leaf, marking the end of a the tree hierarchy.
     * @default '└─'
     */
    leaf: string
  }
  help: {
    /**
     * The help message displayed at the top of the prompt.
     * @param allowCancel - Indicates if canceling is allowed.
     */
    top: (allowCancel: boolean) => string
    /**
     * The help message displayed for directories.
     * @param isCwd - Indicates if the directory is the current directory.
     */
    directory: (isCwd: boolean) => string
    /** The help message displayed for files. */
    file: string
  }
  /**
   * Renders an item in the list.
   * @param item - The item to render.
   * @param context - Additional context about the item.
   */
  renderItem: (item: RawItem, context: RenderContext) => string
}
