import fs from 'node:fs'
import path from 'node:path'

import {
  type KeypressEvent,
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
import type { Choice, FileSelectorConfig } from './types.js'

const CURSOR_HIDE = '\x1B[?25l'

function isEscapeKey(key: KeypressEvent): boolean {
  return key.name === 'escape'
}

function getDirContents(dir: string): Choice[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .map(dirent => ({
      value: dirent.name,
      path: path.join(dirent.parentPath, dirent.name),
      isDir: dirent.isDirectory()
    }))
    .sort((a, b) => {
      if (a.isDir && !b.isDir) {
        return -1 // a is dir, should come first
      }

      if (!a.isDir && b.isDir) {
        return 1 // b is dir, should come first
      }

      // both are files or both are dirs - sort by name
      return a.value.localeCompare(b.value)
    })
}

export default createPrompt(
  (config: FileSelectorConfig, done: (value: string) => void) => {
    const { pageSize = 10, extensions = [] } = config

    const theme = makeTheme()
    const prefix = usePrefix({ theme })
    const [status, setStatus] = useState('pending')
    const [currentDir, setCurrentDir] = useState(
      path.resolve(process.cwd(), config.path || '.')
    )

    const items = useMemo(() => {
      const contents = getDirContents(currentDir)

      for (const item of contents) {
        item.disabled =
          !item.isDir &&
          extensions.length > 0 &&
          !extensions.some(ext => item.value.endsWith(ext))
      }

      return contents.length > 0
        ? contents
        : contents.concat({ value: 'No files found', disabled: true } as Choice)
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

    const selectedContent = items[active]

    useKeypress((key, rl) => {
      if (isEnterKey(key)) {
        if (selectedContent.isDir) {
          setCurrentDir(selectedContent.path)
          setActive(bounds.first)
        } else if (!selectedContent.disabled) {
          setStatus('done')
          done(selectedContent.path)
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
      renderItem({ item, isActive }) {
        if (item.disabled) {
          return chalk.dim(item.value)
        }

        const color = isActive ? theme.style.highlight : (x: string) => x
        const cursor = item.isDir ? `${figures.arrowRight} ` : ''

        return color(`${cursor}${item.value}`)
      },
      pageSize,
      loop: false
    })

    const message = theme.style.message(config.message)

    if (status === 'done') {
      return `${prefix} ${message} ${theme.style.answer(selectedContent.path)}`
    }

    const helpTipTop = `\nCurrent directory: ${theme.style.highlight(`${currentDir}\n`)}`
    const helpTipBottom =
      '\n\n(Use ↑ ↓ to navigate through the list)\n(Press <esc> to navigate to the parent directory)\n(Press <enter> to select a file or navigate to a directory)'

    return `${[prefix, message, helpTipTop].filter(Boolean).join(' ')}\n${page}${helpTipBottom}${CURSOR_HIDE}`
  }
)
