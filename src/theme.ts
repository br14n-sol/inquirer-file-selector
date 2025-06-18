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
    top: (allowCancel: boolean, multiple?: boolean) => {
      const nav = `${figures.arrowUp + figures.arrowDown} to navigate`
      const back = '<backspace> to go back'
      const cancel = allowCancel ? ', <esc> to cancel' : ''
      if (multiple) {
        return `(Press ${nav}, <space> to toggle selection, <right> or <l> to open directories, <enter> to confirm, ${back}${cancel})`
      }
      return `(Press ${nav}, ${back}${cancel})`
    },
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

    // CWD item ('.') should not show a selection marker, even if isSelected is somehow true.
    // item.displayName for CWD is typically './' or '.\'
    const isCurrentDirectoryItem =
      context.isCwd && (item.displayName === './' || item.displayName === '.\\')
    const selectionMarker =
      context.isSelected && !isCurrentDirectoryItem
        ? chalk.green(figures.radioOn) // [x] or (✔)
        : figures.radioOff // [ ] or ( )

    // For CWD, we don't want any marker, just the prefix.
    const displayLinePrefix = isCurrentDirectoryItem
      ? linePrefix
      : `${linePrefix} ${selectionMarker}`

    if (item.isDisabled) {
      // Pass the potentially modified prefix (with or without selection marker)
      return this.style.disabled(displayLinePrefix, item.displayName)
    }

    const baseColor = item.isDirectory ? this.style.directory : this.style.file
    const color = context.isActive ? this.style.active : baseColor
    // Apply color to the item name part, prefix and marker should maintain their style or be styled separately if needed.
    // For now, only item.displayName gets the dynamic color.
    let line = `${displayLinePrefix} ${color(item.displayName)}`

    if (context.isActive) {
      const helpMessage = item.isDirectory
        ? this.help.directory(context.isCwd)
        : this.help.file
      line += ` ${this.style.help(helpMessage)}`
    }

    return line
  }
}
