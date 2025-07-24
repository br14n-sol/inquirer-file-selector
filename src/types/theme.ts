import type { RawItem } from '#types/item'
import type { StatusType } from '#types/status'

// TODO: Move `type` property to dedicated type and reuse it in `PromptConfig`

export type RenderHelpContext = {
  /** Indicates the type of item expected. */
  type: 'file' | 'directory' | undefined
  /** Indicates if multiple items can be selected. */
  multiple: boolean
  /** Indicates if canceling is allowed. */
  allowCancel: boolean
}

export type RenderItemContext = {
  /** Items to render. */
  items: RawItem[]
  /** Indicates the type of item expected. */
  type: 'file' | 'directory' | undefined
  /** Indicates if multiple items can be selected. */
  multiple: boolean
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
    /**
     * Defines the style for key labels used in hints.
     * @default chalk.bgGray.white
     */
    key: (text: string) => string
    /**
     * Defines the style for messages displayed in the prompt.
     */
    messages: {
      /**
       * Defines the style for the cancel message.
       * @default chalk.red
       */
      cancel: (text: string) => string
      /**
       * Defines the style for the empty directory message.
       * @default chalk.red
       */
      empty: (text: string) => string
    }
  }
  /**
   * Labels used throughout the prompt.
   */
  labels: {
    /**
     * Labels used to represent navigation keys.
     * `style.key` is automatically applied to these values.
     */
    keys: {
      /**
       * Label for the "up" navigation key.
       * @default '↑/w'
       */
      up: string
      /**
       * Label for the "down" navigation key.
       * @default '↓/s'
       */
      down: string
      /**
       * Label for the "back" navigation key.
       * @default '←/a'
       */
      back: string
      /**
       * Label for the "forward" navigation key.
       * @default '→/d'
       */
      forward: string
      /**
       * Label for the "toggle selection" key.
       * @default '␣'
       */
      toggle: string
      /**
       * Label for the "confirm" key.
       * @default '↵'
       */
      confirm: string
      /**
       * Label for the "cancel" key.
       * @default 'Esc'
       */
      cancel: string
    }
    /**
     * Hint messages shown to the user, describing available actions.
     * The texts can contain placeholders like `{{up}}`, `{{down}}`, etc.,
     * which will be replaced by the corresponding values from `labels.keys`.
     */
    hints: {
      /**
       * Hint for navigation actions.
       * @default '{{up}} or {{down}} to navigate'
       */
      navigate: string
      /**
       * Hint for going back.
       * @default '{{back}} to go back'
       */
      goBack: string
      /**
       * Hint for going forward (open directory).
       * @default '{{forward}} to open'
       */
      goForward: string
      /**
       * Hint for toggling selection.
       * @default '{{toggle}} to select'
       */
      toggle: string
      /**
       * Hint for confirming the selection.
       * @default '{{confirm}} to confirm'
       */
      confirm: string
      /**
       * Hint for canceling the prompt.
       * @default '{{cancel}} to cancel'
       */
      cancel: string
    }
    /**
     * Messages displayed in the prompt.
     * `style.messages` is automatically applied to these values.
     */
    messages: {
      /**
       * Message displayed when the selection is canceled.
       * @default 'Canceled.'
       */
      cancel: string
      /**
       * Message displayed when the directory is empty.
       * @default 'Directory is empty.'
       */
      empty: string
    }
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
  /**
   * Renders the help message in the header section.
   * @param type - Help type, `'header'`.
   * @param context - Additional context for rendering the help message.
   */
  renderHelp(type: 'header', context: Partial<RenderHelpContext>): string
  /**
   * Renders the help message inline for a specific item.
   * @param type - Help type, `'inline'`.
   * @param item - The item for which to render the help message.
   * @param context - Additional context for rendering the help message.
   */
  renderHelp(
    type: 'inline',
    item: RawItem,
    context: Partial<RenderHelpContext>
  ): string
  /**
   * Renders an item in the list.
   * @param item - The item to render.
   * @param context - Additional context about the item.
   */
  renderItem: (item: RawItem, context: RenderItemContext) => string
}
