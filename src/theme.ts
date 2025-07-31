import figures from '@inquirer/figures'
import chalk from 'chalk'
import type { RawItem } from '#types/item'
import type { StatusType } from '#types/status'
import type {
  PromptTheme,
  RenderHelpContext,
  RenderItemContext
} from '#types/theme'
import { isValidItemType } from '#utils/item'

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
    directory: (text: string) => chalk.yellowBright(text),
    file: (text: string) => text,
    currentDir: (text: string) => chalk.magentaBright(text),
    message: (text: string, _status: StatusType) => chalk.bold(text),
    help: (text: string) => chalk.gray(text),
    key: (text: string) => chalk.bgGray.white(` ${text} `),
    messages: {
      cancel: (text: string) => chalk.red(text),
      empty: (text: string) => chalk.red(text)
    }
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
    },
    messages: {
      cancel: 'Canceled.',
      empty: 'Directory is empty.'
    }
  },
  renderHelp(type: 'inline' | 'header', arg1?: unknown, arg2?: unknown) {
    const hints = []

    if (type === 'header') {
      const context = arg1 as Partial<RenderHelpContext>

      hints.push(this.labels.hints.navigate)
      hints.push(this.labels.hints.goBack)

      context.multiple && hints.push(this.labels.hints.confirm)
      context.allowCancel && hints.push(this.labels.hints.cancel)
    } else if (type === 'inline') {
      const item = arg1 as RawItem
      const context = arg2 as Partial<RenderHelpContext>

      if (!item.isCwd && item.isDirectory) {
        hints.push(this.labels.hints.goForward)
      }

      if (!context.type || isValidItemType(item, context.type)) {
        context.multiple
          ? hints.push(this.labels.hints.toggle)
          : hints.push(this.labels.hints.confirm)
      }
    }

    return hints.length ? this.style.help(`(Press ${hints.join(', ')})`) : ''
  },
  renderItem(item: RawItem, context: RenderItemContext) {
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
      } else if (
        context.isActive &&
        (!context.type || isValidItemType(item, context.type))
      ) {
        line += ` ${figures.radioOff}`
      }
    }

    if (context.isActive) {
      const helpMessage = this.renderHelp('inline', item, {
        type: context.type,
        multiple: context.multiple
      })
      line += ` ${helpMessage}`
    }

    return line
  }
}
