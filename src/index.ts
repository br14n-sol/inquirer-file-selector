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
import { ItemKind } from '#enums/item'
import { Status } from '#enums/status'
import { baseTheme } from '#theme'
import type { PromptConfig } from '#types/config'
import type { Item, ItemKindType } from '#types/item'
import type { StatusType } from '#types/status'
import type { PromptTheme, RenderContext } from '#types/theme'
import { createItemFromPath, listDirectoryItems, sortItems } from '#utils/item'
import {
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isEscapeKey,
  isSpaceKey,
  isUpKey
} from '#utils/key'
import { ANSI_HIDE_CURSOR } from '#utils/string'

const fileSelector = createPrompt<Item | null, PromptConfig>((config, done) => {
  const {
    pageSize = 10,
    loop = false,
    filter = () => true,
    showExcluded = false,
    validate = () => true,
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
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      setStatus(Status.Loading)

      await loadItems(currentDir)

      setStatus(Status.Idle)
    })()
  }, []) // First load

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

  async function loadItems(target: string | Item) {
    try {
      const base = await (async () => {
        if (typeof target !== 'string') {
          return structuredClone(target)
        }

        return await createItemFromPath(currentDir)
      })()
      base.displayName = `.${path.sep}`
      base.isBase = true

      const itemList = await listDirectoryItems(base.path)
      itemList.push(base)

      const filteredItems = itemList
        .map(item => ({
          ...item,
          isDisabled: !filter(item)
        }))
        .filter(item => showExcluded || !item.isDisabled)
      const sortedItems = sortItems(filteredItems)

      setCurrentDir(base.path)
      setItems(sortedItems)
      setActive(0)
    } catch (error) {
      setError((error as Error).message)
    }
  }

  function handleSelectItem(target: Item) {
    // Ignore if the active item is disabled
    if (target.isDisabled) return

    // Ignore if the active item not pass the validation
    if (!validate(target)) return

    // TODO: Prevents the active item from being selected if there is a permission error (?)

    setStatus(Status.Done)
    done(target)
  }

  async function handleOpenDirectory(target: Item) {
    // Ignore if the target is not a directory
    if (target.kind !== ItemKind.Directory) return

    setStatus(Status.Loading)

    target.displayName += ' (loading)' // TODO: This label is provisional

    await loadItems(target)

    setStatus(Status.Idle)
  }

  async function handleGoParentDirectory(target: string) {
    // Ignore if the target is the same as the current directory
    if (target === currentDir) return

    setStatus(Status.Loading)

    await loadItems(target)

    setStatus(Status.Idle)
  }

  function handleCancelPrompt() {
    // Ignore if the prompt does not allow cancellation
    if (!allowCancel) return

    setStatus(Status.Canceled)
    done(null)
  }

  useKeypress(async key => {
    // Block use of keys when status is loading
    if (status === Status.Loading) return

    if (isEnterKey(key)) {
      handleSelectItem(activeItem)
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
    } else if (isSpaceKey(key)) {
      await handleOpenDirectory(activeItem)
    } else if (isBackspaceKey(key)) {
      const target = path.resolve(currentDir, '..')
      await handleGoParentDirectory(target)
    } else if (isEscapeKey(key)) {
      handleCancelPrompt()
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
  const header = theme.style.currentDir(currentDir)

  return [
    `${prefix} ${message} ${helpTop}\n${header}\n${!page.length ? theme.style.emptyText(emptyText) : page}${ANSI_HIDE_CURSOR}`,
    error
  ]
})

export { fileSelector, Status, ItemKind }

export type {
  StatusType,
  PromptConfig,
  Item,
  PromptTheme,
  RenderContext,
  ItemKindType
}
