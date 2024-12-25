import type { Status } from '#types/common'

export interface CustomTheme {
  prefix: {
    /**
     * The prefix to use for the idle status.
     * @default chalk.cyan('?')
     */
    idle: string
    /**
     * The prefix to use for the done status.
     * @default chalk.green(figures.tick)
     */
    done: string
    /**
     * The prefix to use for the canceled status.
     * @default chalk.red(figures.cross)
     */
    canceled: string
  }
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
     * The style to use for the message.
     * @default chalk.bold
     */
    message: (text: string, status: Status) => string
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
