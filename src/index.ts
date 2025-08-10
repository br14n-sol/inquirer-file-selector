import path from 'node:path'
import {
  createPrompt,
  makeTheme,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useRef,
  useState
} from '@inquirer/core'
import { ANSI_HIDE_CURSOR, defaultKeybinds, ItemType, Status } from '#consts'
import { baseTheme } from '#theme'
import type { Keybinds, PromptConfig } from '#types/config'
import type { Item, ItemTypeUnion, RawItem } from '#types/item'
import type { StatusType } from '#types/status'
import type {
  PromptTheme,
  RenderHelpContext,
  RenderItemContext
} from '#types/theme'
import { createActionChecks } from '#utils/actions'
import {
  createRawItem,
  ensurePathSeparator,
  isValidItemType,
  readRawItems,
  sortRawItems,
  stripInternalProps
} from '#utils/item'
import { prepareTheme } from '#utils/theme'

export function fileSelector(
  config: PromptConfig & { multiple?: false; allowCancel?: false }
): Promise<Item>

export function fileSelector(
  config: PromptConfig & { multiple?: false; allowCancel: true }
): Promise<Item | null>

export function fileSelector(
  config: PromptConfig & { multiple: true; allowCancel?: false }
): Promise<Item[]>

export function fileSelector(
  config: PromptConfig & { multiple: true; allowCancel: true }
): Promise<Item[] | null>

export function fileSelector(
  config: PromptConfig
): Promise<Item | Item[] | null> {
  return createPrompt<Item | Item[] | null, PromptConfig>((config, done) => {
    const {
      multiple = false,
      pageSize = 10,
      loop = false,
      filter = () => true,
      showExcluded = false,
      allowCancel = false
    } = config

    const [status, setStatus] = useState<StatusType>(Status.Idle)

    // Create action key checks and memoize it to avoid re-creating on every render
    const action = useMemo(() => {
      return createActionChecks(defaultKeybinds, config.keybinds)
    }, [])
    // Memoize the theme to avoid unnecessary re-computations
    const theme = useMemo(() => {
      const t = makeTheme<PromptTheme>(baseTheme, config.theme)
      prepareTheme(t)

      return t
    }, [])

    const prefix = usePrefix({ status, theme })
    const selections = useRef<RawItem[]>([])

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

      if (config.type !== ItemType.File) {
        const cwd = createRawItem(currentDir)
        cwd.displayName = ensurePathSeparator('.')
        cwd.isCwd = cwd.path === currentDir

        rawItems.unshift(cwd)
      }

      // Mark selected items
      // TODO: Check if is possible optimize this
      if (multiple) {
        for (const rawItem of rawItems) {
          const index = selections.current.findIndex(
            item => item.path === rawItem.path
          )
          rawItem.isSelected = index !== -1
        }
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

    useKeypress(key => {
      if (action.isUp(key) || action.isDown(key)) {
        if (!loop && action.isUp(key) && active === bounds.first) return
        if (!loop && action.isDown(key) && active === bounds.last) return

        const offset = action.isUp(key) ? -1 : 1
        let next = active

        do {
          next = (next + offset + items.length) % items.length
        } while (items[next].isDisabled)

        setActive(next)
      } else if (action.isBack(key)) {
        setCurrentDir(path.resolve(currentDir, '..'))
        setActive(bounds.first)
      } else if (action.isForward(key)) {
        if (!activeItem.isDirectory) return

        setCurrentDir(activeItem.path)
        setActive(bounds.first)
      } else if (action.isToggle(key)) {
        if (!multiple) return
        if (!isValidItemType(activeItem, config.type)) return

        const index = selections.current.findIndex(
          item => item.path === activeItem.path
        )

        if (index === -1) {
          activeItem.isSelected = true
          selections.current.push(activeItem)
        } else {
          activeItem.isSelected = false
          selections.current.splice(index, 1)
        }

        // Force re-render to reflect selection changes
        setActive(active - 1)
        setActive(active)
      } else if (action.isConfirm(key)) {
        if (!activeItem) return

        let result = null

        if (multiple) {
          result = selections.current.map(i => stripInternalProps(i))
        } else {
          if (!isValidItemType(activeItem, config.type)) return

          result = stripInternalProps(activeItem)
        }

        setStatus(Status.Done)
        done(result)
      } else if (action.isCancel(key)) {
        if (!allowCancel) return

        setStatus(Status.Canceled)
        done(null)
      }
    })

    const page = usePagination({
      items,
      active,
      renderItem: ({ item, index, isActive }) =>
        theme.renderItem(item, {
          items,
          type: config.type,
          multiple,
          loop,
          index,
          isActive
        }),
      pageSize,
      loop
    })

    const message = theme.style.message(config.message, status)

    if (status === Status.Canceled) {
      return `${prefix} ${message} ${theme.labels.messages.cancel}`
    }

    if (status === Status.Done) {
      return `${prefix} ${message} ${theme.style.answer(activeItem.path)}`
    }

    const helpTop = theme.renderHelp('header', { allowCancel, multiple })
    const header = theme.style.currentDir(ensurePathSeparator(currentDir))

    return `${prefix} ${message} ${helpTop}\n${header}\n${!page.length ? theme.labels.messages.empty : page}${ANSI_HIDE_CURSOR}`
  })(config)
}

export { Status, ItemType }

export type {
  StatusType,
  PromptConfig,
  Item,
  RawItem,
  ItemTypeUnion,
  PromptTheme,
  RenderHelpContext,
  RenderItemContext,
  Keybinds
}
