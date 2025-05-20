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
import { ANSI_HIDE_CURSOR, Status } from '#consts'
import { baseTheme } from '#theme'
import type { PromptConfig } from '#types/config'
import type { Item, RawItem } from '#types/item'
import type { StatusType } from '#types/status'
import type { PromptTheme, RenderContext } from '#types/theme'
import {
  createRawItem,
  ensurePathSeparator,
  readRawItems,
  sortRawItems,
  stripInternalProps
} from '#utils/item'
import {
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isEscapeKey,
  isSpaceKey,
  isUpKey
} from '#utils/key'

export function fileSelector(
  config: PromptConfig & { allowCancel?: false }
): Promise<Item>

export function fileSelector(
  config: PromptConfig & { allowCancel: true }
): Promise<Item | null>

export function fileSelector(config: PromptConfig): Promise<Item | null> {
  return createPrompt<Item | null, PromptConfig>((config, done) => {
    const {
      pageSize = 10,
      loop = false,
      filter = () => true,
      showExcluded = false,
      allowCancel = false,
      cancelText = 'Canceled.',
      emptyText = 'Directory is empty.'
    } = config

    const [status, setStatus] = useState<StatusType>(Status.Idle)
    const theme = makeTheme<PromptTheme>(baseTheme, config.theme)
    const prefix = usePrefix({ status, theme })

    const [currentDir, setCurrentDir] = useState(
      path.resolve(process.cwd(), config.basePath || '.')
    )

    const items = useMemo(() => {
      const rawItems = readRawItems(currentDir)
        .map(rawItem => {
          const strippedItem = stripInternalProps(rawItem)
          return { ...rawItem, isDisabled: !filter(strippedItem) }
        })
        .filter(rawItem => showExcluded || !rawItem.isDisabled)
      sortRawItems(rawItems)

      if (config.type !== 'file') {
        const cwd = createRawItem(currentDir)
        cwd.displayName = ensurePathSeparator('.')

        rawItems.unshift(cwd)
      }

      return rawItems
    }, [currentDir])

    const bounds = useMemo(() => {
      const first = items.findIndex(rawItem => !rawItem.isDisabled)
      const last = items.findLastIndex(rawItem => !rawItem.isDisabled)

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
          (config.type === 'file' && activeItem.isDirectory) ||
          (config.type === 'directory' && !activeItem.isDirectory)
        ) {
          return
        }

        const strippedItem = stripInternalProps(activeItem)

        setStatus(Status.Done)
        done(strippedItem)
      } else if (isSpaceKey(key) && activeItem.isDirectory) {
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
      renderItem: ({ item, index, isActive }) => {
        const isCwd = item.path === currentDir
        return theme.renderItem(item, { items, loop, index, isActive, isCwd })
      },
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
  })(config)
}

export { Status }

export type {
  StatusType,
  PromptConfig,
  Item,
  RawItem,
  PromptTheme,
  RenderContext
}
