import path from 'node:path'
import {
  createPrompt,
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isSpaceKey,
  isUpKey,
  makeTheme,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useState
} from '@inquirer/core'
import figures from '@inquirer/figures'
import chalk from 'chalk'

import type { FileSelectorConfig, FileSelectorTheme, Status } from './types.js'
import {
  CURSOR_HIDE,
  ensureTrailingSlash,
  getDirFiles,
  getMaxLength,
  isEscapeKey,
  sortFiles
} from './utils.js'

const fileSelectorTheme: FileSelectorTheme = {
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

export default createPrompt<string, FileSelectorConfig>((config, done) => {
  const {
    type = 'file',
    pageSize = 10,
    loop = false,
    showExcluded = false,
    disabledLabel = ' (not allowed)',
    allowCancel = false,
    cancelText = 'Canceled.',
    emptyText = 'Directory is empty.'
  } = config

  const [status, setStatus] = useState<Status>('idle')
  const theme = makeTheme<FileSelectorTheme>(fileSelectorTheme, config.theme)
  const prefix = usePrefix({ status, theme })

  const [currentDir, setCurrentDir] = useState(
    path.resolve(process.cwd(), config.basePath || '.')
  )

  const items = useMemo(() => {
    const files = getDirFiles(currentDir, type)

    for (const file of files) {
      file.isDisabled = config.filter ? !config.filter(file) : false
    }

    return sortFiles(files, showExcluded)
  }, [currentDir])

  const bounds = useMemo(() => {
    const first = items.findIndex(item => !item.isDisabled)
    const last = items.findLastIndex(item => !item.isDisabled)

    if (first === -1) {
      return { first: 0, last: 0 }
    }

    return { first, last }
  }, [items])

  const [active, setActive] = useState(bounds.first)
  const activeItem = items[active]

  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      if (
        activeItem.isDisabled ||
        (type === 'file' && activeItem.isDirectory()) ||
        (type === 'directory' && !activeItem.isDirectory())
      ) {
        return
      }

      setStatus('done')
      done(activeItem.path)
    } else if (isSpaceKey(key) && activeItem.isDirectory()) {
      setCurrentDir(activeItem.path)
      setActive(bounds.first)
    } else if (isUpKey(key) || isDownKey(key)) {
      rl.clearLine(0)

      if (
        loop ||
        (isUpKey(key) && active !== bounds.first) ||
        (isDownKey(key) && active !== bounds.last)
      ) {
        const offset = isUpKey(key) ? -1 : 1
        let next = active

        do {
          next = (next + offset + items.length) % items.length
        } while (items[next].isDisabled)

        setActive(next)
      }
    } else if (isBackspaceKey(key)) {
      setCurrentDir(path.resolve(currentDir, '..'))
      setActive(bounds.first)
    } else if (isEscapeKey(key) && allowCancel) {
      setStatus('canceled')
      done('canceled')
    }
  })

  const page = usePagination({
    items,
    active,
    renderItem({ item, index, isActive }) {
      const isLast = index === items.length - 1
      const linePrefix = theme.icon.linePrefix(isLast)

      const line = item.isDirectory()
        ? `${linePrefix}${ensureTrailingSlash(item.name)}`
        : `${linePrefix}${item.name}`

      if (item.isDisabled) {
        return theme.style.disabled(`${line}${disabledLabel}`)
      }

      const baseColor = item.isDirectory()
        ? theme.style.directory
        : theme.style.file
      const color = isActive ? theme.style.active : baseColor

      return color(line)
    },
    pageSize,
    loop
  })

  const message = theme.style.message(config.message, status)

  if (status === 'canceled') {
    return `${prefix} ${message} ${theme.style.cancelText(cancelText)}`
  }

  if (status === 'done') {
    return `${prefix} ${message} ${theme.style.answer(activeItem.path)}`
  }

  const header = theme.style.currentDir(ensureTrailingSlash(currentDir))
  const helpTip = useMemo(() => {
    const helpTipLines = [
      `${theme.style.key(figures.arrowUp + figures.arrowDown)} navigate, ${theme.style.key('<enter>')} select${allowCancel ? `, ${theme.style.key('<esc>')} cancel` : ''}`,
      `${theme.style.key('<space>')} open directory, ${theme.style.key('<backspace>')} go back`
    ]

    const helpTipMaxLength = getMaxLength(helpTipLines)
    const delimiter = figures.lineBold.repeat(helpTipMaxLength)

    return `${delimiter}\n${helpTipLines.join('\n')}`
  }, [])

  return `${prefix} ${message}\n${header}\n${!page.length ? theme.style.emptyText(emptyText) : page}\n${helpTip}${CURSOR_HIDE}`
})
