import type { Prettify } from '@inquirer/type'
import type { defaultKeybinds } from '#consts'
import type { ItemTypeUnion, RawItem } from '#types/item'
import type { StatusType } from '#types/status'

export type RenderHelpContext = {
  /** Indicates the type of item expected. */
  type?: ItemTypeUnion
  /** Indicates if multiple items can be selected. */
  multiple: boolean
  /** Indicates if canceling is allowed. */
  allowCancel: boolean
}

export type RenderItemContext = {
  /** Items to render. */
  items: RawItem[]
  /** Indicates the type of item expected. */
  type?: ItemTypeUnion
  /** Indicates if multiple items can be selected. */
  multiple: boolean
  /** Indicates if the list is displayed in loop mode. */
  loop: boolean
  /** Item index. */
  index: number
  /** Indicates if the item is active. */
  isActive: boolean
}

/**
 * Defines the complete prompt theme.
 *
 * Default values can be found in the default theme implementation.
 */
export interface PromptTheme {
  /**
   * Prefix displayed before the prompt message.
   * Maps each `StatusType` to its corresponding prefix string.
   */
  prefix: Prettify<Record<StatusType, string>>
  style: {
    /**
     * Defines the style for disabled items.
     */
    disabled: (linePrefix: string, text: string) => string
    /**
     * Defines the style for the active item.
     */
    active: (text: string) => string
    /**
     * Defines the style for items of type `'directory'`.
     */
    directory: (text: string) => string
    /**
     * Defines the style for items of type `'file'`.
     */
    file: (text: string) => string
    /**
     * Defines the style for the current directory header.
     */
    currentDir: (text: string) => string
    /**
     * Defines the style applied to the main message, defined in `config.message`.
     */
    message: (text: string, status: StatusType) => string
    /**
     * Defines the style for help messages.
     */
    help: (text: string) => string
    /**
     * Defines the style for key labels used in hints.
     */
    key: (text: string) => string
    /**
     * Defines the style for messages displayed in the prompt.
     */
    messages: {
      /**
       * Defines the style for the cancel message.
       */
      cancel: (text: string) => string
      /**
       * Defines the style for the empty directory message.
       */
      empty: (text: string) => string
    }
  }
  /**
   * Labels used throughout the prompt.
   */
  labels: {
    /**
     * Labels corresponding to each keybind.
     * `style.key` is automatically applied to these values.
     */
    keys: Prettify<Record<keyof typeof defaultKeybinds, string>>
    /**
     * Hint messages shown to the user, describing available actions.
     * The texts can contain placeholders like `{{up}}`, `{{down}}`, etc.,
     * which will be replaced by the corresponding values from `labels.keys`.
     */
    hints: {
      /**
       * Hint for navigation actions.
       */
      navigate: string
      /**
       * Hint for going back.
       */
      goBack: string
      /**
       * Hint for going forward (open directory).
       */
      goForward: string
      /**
       * Hint for toggling selection.
       */
      toggle: string
      /**
       * Hint for confirming the selection.
       */
      confirm: string
      /**
       * Hint for canceling the prompt.
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
       */
      cancel: string
      /**
       * Message displayed when the directory is empty.
       */
      empty: string
    }
  }
  hierarchySymbols: {
    /**
     * Symbol representing a branch in the tree hierarchy.
     */
    branch: string
    /**
     * Symbol representing a leaf, marking the end of the tree hierarchy.
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
