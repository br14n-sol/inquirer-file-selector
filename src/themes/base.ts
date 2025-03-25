import figures from '@inquirer/figures'
import chalk from 'chalk'
import type { StatusType } from '#types/common'
import type { FileStats } from '#types/file'
import type { CustomTheme, RenderContext } from '#types/theme'
import { ensurePathSeparator } from '#utils/file'

const theme: CustomTheme = {
  prefix: {
    idle: chalk.cyan('?'),
    done: chalk.green(figures.tick),
    canceled: chalk.red(figures.cross)
  },
  style: {
    disabled: (linePrefix: string, text: string) =>
      chalk.dim(`${linePrefix} ${chalk.strikethrough(text)}`),
    active: (text: string) => chalk.cyan(text),
    cancelText: (text: string) => chalk.red(text),
    emptyText: (text: string) => chalk.red(text),
    directory: (text: string) => chalk.yellow(text),
    file: (text: string) => chalk.white(text),
    currentDir: (text: string) => chalk.magenta(text),
    message: (text: string, _status: StatusType) => chalk.bold(text),
    help: (text: string) => chalk.italic.dim(text),
    key: (text: string) => chalk.cyan(text)
  },
  hierarchySymbols: {
    branch: figures.lineUpDownRight + figures.line,
    leaf: figures.lineUpRight + figures.line
  },
  help: {
    top: (allowCancel: boolean) =>
      `(Press ${figures.arrowUp + figures.arrowDown} to navigate, <backspace> to go back${allowCancel ? ', <esc> to cancel' : ''})`,
    directory: (isRoot: boolean) =>
      `(Press ${!isRoot ? '<space> to open, ' : ''}<enter> to select)`,
    file: '(Press <enter> to select)'
  },
  renderItem(item: FileStats, context: RenderContext) {
    const isLast = context.index === context.items.length - 1
    const linePrefix =
      isLast && !context.loop
        ? this.hierarchySymbols.leaf
        : this.hierarchySymbols.branch
    const isDirectory = item.isDirectory()
    const isRoot = item.name === '.'
    const name = isDirectory ? ensurePathSeparator(item.name) : item.name

    if (item.isDisabled) {
      return this.style.disabled(linePrefix, name)
    }

    const baseColor = isDirectory ? this.style.directory : this.style.file
    const color = context.isActive ? this.style.active : baseColor
    let line = color(`${linePrefix} ${name}`)

    if (context.isActive) {
      const help = isDirectory ? this.help.directory(isRoot) : this.help.file
      line += ` ${this.style.help(help)}`
    }

    return line
  }
}

export default theme
