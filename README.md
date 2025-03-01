<h1 align="center">
  inquirer-file-selector
</h1>

<p align="center">
  An file selector prompt implementation for <a href="https://github.com/SBoudrias/Inquirer.js">Inquirer.js</a>.
</p>

<div align="center">

  ![license](https://img.shields.io/npm/l/inquirer-file-selector)
  ![node-current](https://img.shields.io/node/v/inquirer-file-selector?color=darkgreen)
  ![version](https://img.shields.io/npm/v/inquirer-file-selector?color=orange)
  ![unpacked-size](https://img.shields.io/npm/unpacked-size/inquirer-file-selector)
  ![downloads](https://img.shields.io/npm/dt/inquirer-file-selector.svg)

  ![preview](https://github.com/br14n-sol/inquirer-file-selector/blob/main/preview.gif?raw=true)

</div>

## Installation

```shell
npm install inquirer-file-selector
```

## Usage

```ts
import fileSelector from 'inquirer-file-selector'

const filePath = await fileSelector({
  message: 'Select a file:',
  ...
})
```

## Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `message` | `string` | ✔ | The message to display in the prompt. |
| `basePath` | `string` | | The path to the directory where it will be started.<br/> **Default**: `process.cwd()` |
| `type` | `'file'︱'directory'︱'file+directory'` | | The type of elements that are valid selection options.<br/> **Default**: `'file'` |
| `pageSize` | `number` | | The maximum number of items to display in the list.<br/> **Default**: `10` |
| `loop` | `boolean` | | If `true`, the list will loop from the last item to the first item and vice versa.<br/> **Default**: `false` |
| `filter` | `(file: FileStats) => boolean` | | A function to filter files and directories.<br/> If not provided, all files and directories will be included by default. |
| `showExcluded` | `boolean` | | If `true`, the list will include files and directories that are excluded by the `filter` function.<br/> **Default**: `false` |
| `disabledLabel` | `string` | | The label to display when a file is disabled.<br/> **Default**: ` (not allowed)` |
| `allowCancel` | `boolean` | | If true, the prompt will allow the user to cancel the selection.<br/> **Default**: `false` |
| `cancelText` | `string` | | The message to display when the user cancels the selection.<br/> **Default**: `Canceled.` |
| `emptyText` | `string` | | The message that will be displayed when the directory is empty.<br/> **Default**: `Directory is empty.` |
| `theme` | [See Theming](#theming) | | The theme to use for the file selector. |

## Theming

You can theme a prompt by passing a `theme` object option. The theme object only need to includes the keys you wish to modify, we'll fallback on the defaults for the rest.

```ts
type FileSelectorTheme = {
  prefix: {
    idle: string
    done: string
    canceled: string
  }
  icon: {
    linePrefix: (isLast: boolean) => string
  }
  style: {
    disabled: (text: string) => string
    active: (text: string) => string
    cancelText: (text: string) => string
    emptyText: (text: string) => string
    directory: (text: string) => string
    file: (text: string) => string
    currentDir: (text: string) => string
    message: (text: string, status: 'idle' | 'done' | 'canceled') => string
    help: (text: string) => string
    key: (text: string) => string
  }
}
```

> [!NOTE]
> To see the default theme used by the prompt, look at the [fileSelectorTheme](src/index.ts#L30) constant and the [FileSelectorTheme](src/types.ts#L5) type.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Copyright & License

© 2024 [Brian Fernandez](https://github.com/br14n-sol)

This project is licensed under the MIT license. See the file [LICENSE](LICENSE) for details.
