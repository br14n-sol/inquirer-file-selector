import figures from '@inquirer/figures'
import chalk from 'chalk'

import type { Status } from '#types/common'
import type { CustomTheme } from '#types/theme'

const theme: CustomTheme = {
  prefix: {
    idle: chalk.cyan('?'),
    done: chalk.green(figures.tick),
    canceled: chalk.red(figures.cross)
  },
  icon: {
    linePrefix: (isLast: boolean) => {
      return isLast
        ? `${figures.lineUpRight}${figures.line.repeat(2)} `
        : `${figures.lineUpDownRight}${figures.line.repeat(2)} `
    }
  },
  style: {
    disabled: (text: string) => chalk.dim(text),
    active: (text: string) => chalk.cyan(text),
    cancelText: (text: string) => chalk.red(text),
    emptyText: (text: string) => chalk.red(text),
    directory: (text: string) => chalk.yellow(text),
    file: (text: string) => chalk.white(text),
    currentDir: (text: string) => chalk.magenta(text),
    message: (text: string, _status: Status) => chalk.bold(text),
    help: (text: string) => chalk.white(text),
    key: (text: string) => chalk.cyan(text)
  }
}

export default theme
