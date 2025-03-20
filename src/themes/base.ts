import figures from '@inquirer/figures'
import chalk from 'chalk'
import { ItemKind } from '#enums/item'
import type { StatusType } from '#types/common'
import type { Item } from '#types/item'
import type { CustomTheme, RenderContext } from '#types/theme'

const theme: CustomTheme = {
  prefix: {
    idle: chalk.cyan('?'),
    done: chalk.green(figures.tick),
    canceled: chalk.red(figures.cross)
  },
  style: {
    disabled: (text: string) => chalk.dim(text),
    active: (text: string) => chalk.cyan(text),
    cancelText: (text: string) => chalk.red(text),
    emptyText: (text: string) => chalk.red(text),
    directory: (text: string) => chalk.yellow(text),
    file: (text: string) => chalk.white(text),
    currentDir: (text: string) => chalk.magenta(text),
    message: (text: string, _status: StatusType) => chalk.bold(text),
    help: (text: string) => chalk.white(text),
    key: (text: string) => chalk.cyan(text)
  },
  labels: {
    disabled: '(not allowed)'
  },
  hierarchySymbols: {
    branch: figures.lineUpDownRight + figures.line,
    leaf: figures.lineUpRight + figures.line
  },
  renderItem(item: Item, context: RenderContext) {
    const isLast = context.index === context.items.length - 1
    const linePrefix =
      isLast && !context.loop
        ? this.hierarchySymbols.leaf
        : this.hierarchySymbols.branch
    const line = `${linePrefix} ${item.displayName}`

    if (item.isDisabled) {
      return this.style.disabled(`${line} ${this.labels.disabled}`)
    }

    const isDirectory = item.kind === ItemKind.Directory
    const baseColor = isDirectory ? this.style.directory : this.style.file
    const color = context.isActive ? this.style.active : baseColor

    return color(line)
  }
}

export default theme
