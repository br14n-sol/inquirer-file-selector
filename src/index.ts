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
import { ensurePathSeparator, listDirFiles } from '#utils/file'
import { getItemStat, sortItems } from '#utils/item'
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

    async function listItems(target: Item | string) {
      if (typeof target === 'string') {
        const { data: root, error } = await getItemStat(target)

        if (error) {
          // TODO: Think about how to handle these errors (listItems->getItemStat)
          console.log(error)
          return
        }

        // biome-ignore lint/style/noParameterAssign: This is provisional (?)
        target = root
      }

      const dirFiles = await listDirFiles(target.path)

      if (dirFiles.error) {
        // TODO: Think about how to handle these errors (listItems->listDirFiles)
        console.log(dirFiles.error)
        return
      }

      const itemList = []
      for (const fileName of dirFiles.data) {
        const filePath = path.join(target.path, fileName)
        const { data: newItem, error } = await getItemStat(filePath)

        if (error) {
          // TODO: Think about how to handle these errors (listItems->getItemStat)
          console.log(error)
          continue
        }

        if (config.filter) {
          newItem.isDisabled = !config.filter(newItem)
        }

        if (!showExcluded && newItem.isDisabled) {
          continue
        }

        itemList.push(newItem)
      }

      const sortedItems = sortItems(itemList)

      if (config.type !== 'file') {
        const root = structuredClone(target)
        root.displayName = './'

        sortedItems.unshift(root)
      }

      setItems(sortedItems)
    }

    useEffect(() => {
      listItems(currentDir)
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

    async function handleOpenDirectory(target: Item) {
      setStatus(Status.Loading)
      target.displayName += ' (loading)' // TODO: This label is provisional

      await listItems(target)

      setCurrentDir(target.path)
      setActive(0)

      setStatus(Status.Idle)
    }

    async function handleGoParentDirectory(target: string) {
      setStatus(Status.Loading)

      // TODO: Run this only if target is different from currentDir
      await listItems(target)

      setCurrentDir(target)
      setActive(0)

      setStatus(Status.Idle)
    }

    useKeypress(async key => {
      // Block use of keys when status is loading
      if (status === Status.Loading) return

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

        await handleOpenDirectory(activeItem)
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
        await handleGoParentDirectory(path.resolve(currentDir, '..'))
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
