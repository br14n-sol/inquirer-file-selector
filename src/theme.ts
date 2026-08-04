import { styleText } from 'node:util'
import figures from '@inquirer/figures'
import type { RawItem } from '#types/item'
import type { PromptTheme, RenderHelpContext } from '#types/theme'
import { isValidItemType } from '#utils/item'

export const baseTheme: PromptTheme = {
  prefix: {
    idle: styleText('cyan', '?'),
    done: styleText('green', figures.tick),
    canceled: styleText('red', figures.cross)
  },
  style: {
    active: text => styleText('cyan', text),
    directory: text => styleText('yellowBright', text),
    file: text => text,
    currentDir: text => styleText('magentaBright', text),
    message: (text, _status) => styleText('bold', text),
    help: text => styleText('gray', text),
    key: text => styleText(['bgGray', 'white'], ` ${text} `),
    messages: {
      cancel: text => styleText('red', text),
      empty: text => styleText('red', text)
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
  renderHelp(type, arg1?, arg2?) {
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

      if (isValidItemType(item, context.type)) {
        context.multiple
          ? hints.push(this.labels.hints.toggle)
          : hints.push(this.labels.hints.confirm)
      }
    }

    return hints.length ? this.style.help(`(Press ${hints.join(', ')})`) : ''
  },
  renderItem(item, context) {
    const isLast = context.index === context.items.length - 1
    const linePrefix =
      isLast && !context.loop
        ? this.hierarchySymbols.leaf
        : this.hierarchySymbols.branch
    const baseColor = item.isDirectory ? this.style.directory : this.style.file
    const color = context.isActive ? this.style.active : baseColor
    let line = color(`${linePrefix} ${item.displayName}`)

    if (context.multiple) {
      if (item.isSelected) {
        line += ` ${figures.radioOn}`
      } else if (context.isActive && isValidItemType(item, context.type)) {
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
