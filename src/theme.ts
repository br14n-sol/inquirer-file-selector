import figures from '@inquirer/figures'
import chalk from 'chalk'
import type { RawItem } from '#types/item'
import type { StatusType } from '#types/status'
import type { PromptTheme, RenderContext } from '#types/theme'

export const baseTheme: PromptTheme = {
  prefix: {
    idle: chalk.cyan('?'),
    done: chalk.green(figures.tick),
    canceled: chalk.red(figures.cross)
  },
  style: {
    disabled: (linePrefix: string, text: string) =>
      chalk.gray(`${linePrefix} ${chalk.strikethrough(text)}`),
    active: (text: string) => chalk.cyan(text),
    cancelText: (text: string) => chalk.red(text),
    emptyText: (text: string) => chalk.red(text),
    directory: (text: string) => chalk.yellowBright(text),
    file: (text: string) => text,
    currentDir: (text: string) => chalk.magentaBright(text),
    message: (text: string, _status: StatusType) => chalk.bold(text),
    help: (text: string) => chalk.italic.gray(text)
  },
  hierarchySymbols: {
    branch: figures.lineUpDownRight + figures.line,
    leaf: figures.lineUpRight + figures.line
  },
  help: {
    top: (allowCancel: boolean) =>
      `(Press ${figures.arrowUp + figures.arrowDown} to navigate, <backspace> to go back${allowCancel ? ', <esc> to cancel' : ''})`,
    directory: (isCwd: boolean) =>
      `(Press ${!isCwd ? '<space> to open, ' : ''}<enter> to select)`,
    file: '(Press <enter> to select)'
  },
  renderItem(item: RawItem, context: RenderContext) {
    const isLast = context.index === context.items.length - 1
    const linePrefix =
      isLast && !context.loop
        ? this.hierarchySymbols.leaf
        : this.hierarchySymbols.branch

    if (item.isDisabled) {
      return this.style.disabled(linePrefix, item.displayName)
    }

    const baseColor = item.isDirectory ? this.style.directory : this.style.file
    const color = context.isActive ? this.style.active : baseColor
    let line = color(`${linePrefix} ${item.displayName}`)

    if (context.isActive) {
      const helpMessage = item.isDirectory
        ? this.help.directory(context.isCwd)
        : this.help.file
      line += ` ${this.style.help(helpMessage)}`
    }

    return line
  }
}
