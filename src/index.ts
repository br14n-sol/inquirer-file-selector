import path from 'node:path'
import {
  createPrompt,
  makeTheme,
  useEffect,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useState
} from '@inquirer/core'
import figures from '@inquirer/figures'
import { Status } from '#enums/common'
import { ItemKind } from '#enums/item'
import baseTheme from '#themes/base'
import type { StatusType } from '#types/common'
import type { FileSelectorConfig } from '#types/config'
import type { Item } from '#types/item'
import type { ItemKindType } from '#types/item'
import type { CustomTheme, RenderContext } from '#types/theme'
import { ensurePathSeparator, getFileStat, listDirFiles } from '#utils/file'
import { sortItems, toItem } from '#utils/item'
import {
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isEscapeKey,
  isSpaceKey,
  isUpKey
} from '#utils/key'
import { ANSI_HIDE_CURSOR, getMaxLength } from '#utils/string'

const fileSelector = createPrompt<string | null, FileSelectorConfig>(
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
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
      ;(async () => {
        const { data: rootStats, error: error3 } = await getFileStat(currentDir)

        if (error3) {
          // TODO: handle this
          return
        }

        const rootItem = toItem('. (current directory)', currentDir, rootStats)

        const { data: fileList, error } = await listDirFiles(currentDir)

        if (error) {
          // TODO: handle this
          return
        }

        const itemList = []
        for (const filename of fileList) {
          const filePath = path.join(currentDir, filename)
          const { data: fileStats, error: error2 } = await getFileStat(filePath)

          if (error2) {
            // TODO: handle this
            continue
          }

          const itemObj = toItem(filename, filePath, fileStats)
          if (config.filter) {
            itemObj.isDisabled = !config.filter(itemObj)
          }

          if (!showExcluded && itemObj.isDisabled) {
            continue
          }

          itemList.push(itemObj)
        }

        const sortedItems = sortItems(itemList)

        if (config.type !== 'file') {
          sortedItems.unshift(rootItem)
        }

        setItems(itemList)
      })()
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

    useKeypress(key => {
      if (isEnterKey(key)) {
        // TODO: Prevents the active item from being selected if there is a permission error.

        if (
          activeItem.isDisabled ||
          (config.type === 'file' && activeItem.kind === ItemKind.Directory) ||
          (config.type === 'directory' &&
            activeItem.kind !== ItemKind.Directory)
        ) {
          return
        }

        setStatus(Status.Done)
        done(activeItem.path)
      } else if (isSpaceKey(key)) {
        if (activeItem.kind !== ItemKind.Directory) return

        // TODO: Prevent the current directory from being updated if there is a permission error.

        setCurrentDir(activeItem.path)
        setActive(bounds.first)
      } else if (isUpKey(key) || isDownKey(key)) {
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
      } else if (isEscapeKey(key)) {
        if (!allowCancel) return

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

    const header = theme.style.currentDir(ensurePathSeparator(currentDir))
    const helpTip = useMemo(() => {
      const helpTipLines = [
        `${theme.style.key(figures.arrowUp + figures.arrowDown)} navigate, ${theme.style.key('<enter>')} select${allowCancel ? `, ${theme.style.key('<esc>')} cancel` : ''}`,
        `${theme.style.key('<space>')} open directory, ${theme.style.key('<backspace>')} go back`
      ]

      const helpTipMaxLength = getMaxLength(helpTipLines)
      const delimiter = figures.lineBold.repeat(helpTipMaxLength)

      return `${delimiter}\n${helpTipLines.join('\n')}`
    }, [])

    return `${prefix} ${message}\n${header}\n${!page.length ? theme.style.emptyText(emptyText) : page}\n${helpTip}${ANSI_HIDE_CURSOR}`
  }
)

export { fileSelector, Status, ItemKind }

export type {
  StatusType,
  FileSelectorConfig,
  Item,
  CustomTheme,
  RenderContext,
  ItemKindType
}
