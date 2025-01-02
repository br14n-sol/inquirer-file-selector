import type { Status } from '#types/common'

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
  icon: {
    /**
     * Prefix to use for the line.
     * @default isLast => isLast ? └── : ├──
     */
    linePrefix: (isLast: boolean) => string
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
    message: (text: string, status: Status) => string
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
}
