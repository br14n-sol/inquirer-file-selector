import path from 'node:path'
import {
  createPrompt,
  isBackspaceKey,
  isDownKey,
  isEnterKey,
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

import type { FileSelectorConfig, FileSelectorTheme } from './types.js'
import {
  CURSOR_HIDE,
  ensureTrailingSlash,
  getDirItems,
  getMaxLength,
  isEscapeKey,
  matchCheck,
  sortItems
} from './utils.js'

const fileSelectorTheme: FileSelectorTheme = {
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
    help: (text: string) => chalk.white(text),
    key: (text: string) => chalk.cyan(text)
  }
}

export default createPrompt<string, FileSelectorConfig>((config, done) => {
  const {
    pageSize = 10,
    hideNonMatch = false,
    disabledLabel = ' (not allowed)',
    allowCancel = false
  } = config
  const cancelText = config.cancelText || config.canceledLabel || 'Canceled.'
  const emptyText =
    config.emptyText || config.noFilesFound || 'Directory is empty.'

  if (config.theme?.style?.noFilesFound) {
    config.theme.style.emptyText ??= config.theme.style.noFilesFound
  }

  const [status, setStatus] = useState('pending')
  const theme = makeTheme<FileSelectorTheme>(fileSelectorTheme, config.theme)
  const prefix = usePrefix({ theme })

  const [currentDir, setCurrentDir] = useState(
    path.resolve(process.cwd(), config.basePath || config.path || '.')
  )

  const items = useMemo(() => {
    const _items = getDirItems(currentDir)

    for (const item of _items) {
      item.isDisabled = !item.isDir && !matchCheck(item, config.match)
    }

    return sortItems(_items, hideNonMatch)
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
      if (activeItem.isDir) {
        if (activeItem.name === '.') {
          setStatus('done')
          done(activeItem.path)
        } else {
          setCurrentDir(activeItem.path)
          setActive(bounds.first)
        }
      } else if (!activeItem.isDisabled) {
        setStatus('done')
        done(activeItem.path)
      }
    } else if (isUpKey(key) || isDownKey(key)) {
      rl.clearLine(0)

      if (
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

      if (item.isDisabled) {
        return theme.style.disabled(`${linePrefix}${item.name}${disabledLabel}`)
      }

      const baseColor = item.isDir ? theme.style.directory : theme.style.file
      const color = isActive ? theme.style.active : baseColor

      const line = item.isDir
        ? `${linePrefix}${ensureTrailingSlash(item.name)}`
        : `${linePrefix}${item.name}`

      return color(line)
    },
    pageSize,
    loop: false
  })

  const message = theme.style.message(config.message)

  if (status === 'canceled') {
    return `${prefix} ${message} ${theme.style.cancelText(cancelText)}`
  }

  if (status === 'done') {
    return `${prefix} ${message} ${theme.style.answer(activeItem.path)}`
  }

  const header = theme.style.currentDir(ensureTrailingSlash(currentDir))
  const helpTip = useMemo(() => {
    const helpTipLines = [
      `${theme.style.key(figures.arrowUp + figures.arrowDown)} navigate, ${theme.style.key('<enter>')} select or open directory`,
      `${theme.style.key('<backspace>')} go back${allowCancel ? `, ${theme.style.key('<esc>')} cancel` : ''}`
    ]

    const helpTipMaxLength = getMaxLength(helpTipLines)
    const delimiter = figures.lineBold.repeat(helpTipMaxLength)

    return `${delimiter}\n${helpTipLines.join('\n')}`
  }, [])

  return `${prefix} ${message}\n${header}\n${!page.length ? theme.style.emptyText(emptyText) : page}\n${helpTip}${CURSOR_HIDE}`
})
