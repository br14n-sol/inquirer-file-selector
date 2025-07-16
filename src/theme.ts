import figures from '@inquirer/figures'
import chalk from 'chalk'
import { Actions } from '#consts'
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
    help: (text: string) => chalk.gray(text),
    key: (text: string) => chalk.bgGray.white(` ${text} `)
  },
  hierarchySymbols: {
    branch: figures.lineUpDownRight + figures.line,
    leaf: figures.lineUpRight + figures.line
  },
  renderHelp(type, item, context) {
    switch (type) {
      case 'header': {
        const tips = []
        tips.push(
          `${this.style.key(Actions.Up.label)} or ${this.style.key(Actions.Down.label)} to navigate`
        )
        tips.push(`${this.style.key(Actions.Back.label)} to go back`)

        if (context?.multiple) {
          tips.push(`${this.style.key(Actions.Confirm.label)} to confirm`)
        }

        if (context?.allowCancel) {
          tips.push(`${this.style.key(Actions.Cancel.label)} to cancel`)
        }

        return this.style.help(`(Press ${tips.join(', ')})`)
      }
      case 'inline': {
        const tips = []

        if (!item?.isCwd && item?.isDirectory) {
          tips.push(`${this.style.key(Actions.Forward.label)} to open`)
        }

        if (context?.multiple) {
          tips.push(`${this.style.key(Actions.Toggle.label)} to select`)
        } else {
          tips.push(`${this.style.key(Actions.Confirm.label)} to select`)
        }

        return this.style.help(`(Press ${tips.join(', ')})`)
      }
    }
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

    if (context.multiple) {
      if (item.isSelected) {
        line += ` ${figures.radioOn}`
      } else if (context.isActive) {
        line += ` ${figures.radioOff}`
      }
    }

    if (context.isActive) {
      const helpMessage = this.renderHelp('inline', item, {
        allowCancel: false,
        multiple: context.multiple
      })
      line += ` ${this.style.help(helpMessage)}`
    }

    return line
  }
}
