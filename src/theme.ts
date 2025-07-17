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
    help: (text: string) => chalk.gray(text),
    key: (text: string) => chalk.bgGray.white(` ${text} `)
  },
  hierarchySymbols: {
    branch: figures.lineUpDownRight + figures.line,
    leaf: figures.lineUpRight + figures.line
  },
  labels: {
    keys: {
      up: `${figures.arrowUp}/w`,
      down: `${figures.arrowDown}/s`,
      back: `${figures.arrowLeft}/a`,
      forward: `${figures.arrowRight}/d`,
      toggle: '\u2423', // ␣
      confirm: '\u21B5', // ↵
      cancel: 'Esc'
    },
    hints: {
      navigate: '{{up}} or {{down}} to navigate',
      goBack: '{{back}} to go back',
      goForward: '{{forward}} to open',
      toggle: '{{toggle}} to select',
      confirm: '{{confirm}} to confirm',
      cancel: '{{cancel}} to cancel'
    }
  },
  renderHelp(type, item, context) {
    switch (type) {
      case 'header': {
        const hints = []
        hints.push(this.labels.hints.navigate)
        hints.push(this.labels.hints.goBack)

        context?.multiple && hints.push(this.labels.hints.confirm)
        context?.allowCancel && hints.push(this.labels.hints.cancel)

        return this.style.help(`(Press ${hints.join(', ')})`)
      }
      case 'inline': {
        const hints = []

        if (!item?.isCwd && item?.isDirectory) {
          hints.push(this.labels.hints.goForward)
        }

        context?.multiple
          ? hints.push(this.labels.hints.toggle)
          : hints.push(this.labels.hints.confirm)

        return this.style.help(`(Press ${hints.join(', ')})`)
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
