import path from 'node:path'
import {
  createPrompt,
  makeTheme,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useState
} from '@inquirer/core'

import { Status } from '#enums/common'
import baseTheme from '#themes/base'
import type { StatusType } from '#types/common'
import type { FileSelectorConfig } from '#types/config'
import type { FileStats } from '#types/file'
import type { CustomTheme, RenderContext } from '#types/theme'
import {
  createFileStats,
  ensurePathSeparator,
  getDirFiles,
  sortFiles
} from '#utils/file'
import {
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isEscapeKey,
  isSpaceKey,
  isUpKey
} from '#utils/key'
import { ANSI_HIDE_CURSOR } from '#utils/string'

const fileSelector = createPrompt<FileStats | null, FileSelectorConfig>(
  (config, done) => {
    const {
      pageSize = 10,
      loop = false,
      showExcluded = false,
      allowCancel = false,
      cancelText = 'Canceled.',
      emptyText = 'Directory is empty.'
    } = config

    const [status, setStatus] = useState<StatusType>(Status.Idle)
    const theme = makeTheme<CustomTheme>(baseTheme, config.theme)
    const prefix = usePrefix({ status, theme })

    const [currentDir, setCurrentDir] = useState(
      path.resolve(process.cwd(), config.basePath || '.')
    )

    const items = useMemo(() => {
      const files = getDirFiles(currentDir)

      for (const file of files) {
        file.isDisabled = config.filter ? !config.filter(file) : false
      }

      const filteredFiles = files.filter(
        file => showExcluded || !file.isDisabled
      )
      const sortedFiles = sortFiles(filteredFiles)

      if (config.type !== 'file') {
        const root = createFileStats(currentDir)
        root.name = '.'

        sortedFiles.unshift(root)
      }

      return sortedFiles
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
          (config.type === 'file' && activeItem.isDirectory()) ||
          (config.type === 'directory' && !activeItem.isDirectory())
        ) {
          return
        }

        setStatus(Status.Done)
        done(activeItem)
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
        setStatus(Status.Canceled)
        done(null)
      }
    })

    const page = usePagination({
      items,
      active,
      renderItem: ({ item, index, isActive }) =>
        theme.renderItem(item, { items, index, isActive, loop }),
      pageSize,
      loop
    })

    const message = theme.style.message(config.message, status)

    if (status === Status.Canceled) {
      return `${prefix} ${message} ${theme.style.cancelText(cancelText)}`
    }

    if (status === Status.Done) {
      return `${prefix} ${message} ${theme.style.answer(activeItem.path)}`
    }

    const helpTop = theme.style.help(theme.help.top(allowCancel))
    const header = theme.style.currentDir(ensurePathSeparator(currentDir))

    return `${prefix} ${message} ${helpTop}\n${header}\n${!page.length ? theme.style.emptyText(emptyText) : page}${ANSI_HIDE_CURSOR}`
  }
)

export { fileSelector, Status }

export type {
  StatusType,
  FileSelectorConfig,
  FileStats,
  CustomTheme,
  RenderContext
}
