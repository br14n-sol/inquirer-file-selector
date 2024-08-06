import path from 'node:path'
import {
  createPrompt,
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
  getDirContents,
  getMaxLength,
  isEscapeKey
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
    noFilesFound: (text: string) => chalk.red(text),
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
    extensions = [],
    disabledLabel = ' (not allowed)',
    noFilesFound = 'No files found'
  } = config
  const [status, setStatus] = useState('pending')
  const [currentDir, setCurrentDir] = useState(
    path.resolve(process.cwd(), config.path || '.')
  )
  const theme = makeTheme<FileSelectorTheme>(fileSelectorTheme, config.theme)
  const prefix = usePrefix({ theme })

  const items = useMemo(() => {
    const contents = getDirContents(currentDir)

    function extensionCheck(extensions, item) {
      if (Array.isArray(extensions)) {
        return extensions.length > 0
          ? extensions.some((ext) => item.value.endsWith(ext))
          : true;
      } else if (typeof extensions === "function") {
        return extensions(item);
      } else {
        return true;
      }
    }

    for (const item of contents) {
      item.disabled = !item.isDir && !extensionCheck(extensions, item);
    }

    return contents
  }, [currentDir])

  const bounds = useMemo(() => {
    const first = items.findIndex(item => !item.disabled)
    const last = items.findLastIndex(item => !item.disabled)

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
        setCurrentDir(activeItem.path)
        setActive(bounds.first)
      } else if (!activeItem.disabled) {
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
        } while (items[next].disabled)

        setActive(next)
      }
    } else if (isEscapeKey(key)) {
      setCurrentDir(path.resolve(currentDir, '..'))
      setActive(bounds.first)
    }
  })

  const page = usePagination({
    items,
    active,
    renderItem({ item, index, isActive }) {
      const isLast = index === items.length - 1
      const linePrefix = theme.icon.linePrefix(isLast)

      if (item.disabled) {
        return theme.style.disabled(
          `${linePrefix}${item.value}${disabledLabel}`
        )
      }

      const baseColor = item.isDir ? theme.style.directory : theme.style.file
      const color = isActive ? theme.style.active : baseColor

      const line = item.isDir
        ? `${linePrefix}${ensureTrailingSlash(item.value)}`
        : `${linePrefix}${item.value}`

      return color(line)
    },
    pageSize,
    loop: false
  })

  const message = theme.style.message(config.message)

  if (status === 'done') {
    return `${prefix} ${message} ${theme.style.answer(activeItem.path)}`
  }

  const header = theme.style.currentDir(ensureTrailingSlash(currentDir))
  const helpTip = useMemo(() => {
    const helpTipLines = [
      theme.style.help(
        `Use ${theme.style.key(figures.arrowUp + figures.arrowDown)} to navigate through the list`
      ),
      theme.style.help(
        `Press ${theme.style.key('<esc>')} to navigate to the parent directory`
      ),
      theme.style.help(
        `Press ${theme.style.key('<enter>')} to select a file or navigate to a directory`
      )
    ]
    const helpTipMaxLength = getMaxLength(helpTipLines)
    const delimiter = figures.lineBold.repeat(helpTipMaxLength)

    return `${delimiter}\n${helpTipLines.join('\n')}`
  }, [])

  return `${prefix} ${message}\n${header}\n${page.length > 0 ? page : theme.style.noFilesFound(noFilesFound)}\n${helpTip}${CURSOR_HIDE}`
})
