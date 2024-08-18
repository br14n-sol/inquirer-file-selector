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
| `path` | `string` | | The path to the directory where it will be started.<br/> **Default**: `process.cwd()` |
| `pageSize` | `number` | | The maximum number of items to display in the list.<br/> **Default**: `10` |
| `match` | `(file: Item) => boolean` | | A function to filter the files.<br/> If not provided, all files will be included. |
| `hideNonMatch` | `boolean` | | If true, the list will be filtered to show only files that match the `match` function.<br/> **Default**: `false` |
| `disabledLabel` | `string` | | The label to display when a file is disabled.<br/> **Default**: ` (not allowed)` |
| `allowCancel` | `boolean` | | If true, the prompt will allow the user to cancel the selection.<br/> **Default**: `false` |
| `cancelText` | `string` | | The message to display when the user cancels the selection.<br/> **Default**: `Canceled.` |
| `emptyText` | `string` | | The message that will be displayed when the directory is empty.<br/> **Default**: `Directory is empty.` |
| `theme` | [See Theming](#theming) | | The theme to use for the file selector. |
| ~~`canceledLabel`~~ | ~~`string`~~ | | **Deprecated**: Use `cancelText` instead. Will be removed in the next major version. |
| ~~`noFilesFound`~~ | ~~`string`~~ | | **Deprecated**: Use `emptyText` instead. Will be removed in the next major version. |

## Theming

You can theme a prompt by passing a `theme` object option. The theme object only need to includes the keys you wish to modify, we'll fallback on the defaults for the rest.

```ts
type FileSelectorTheme = {
  icon: {
    /**
     * The prefix to use for the line.
     * @default isLast => isLast ? └── : ├──
     */
    linePrefix: (isLast: boolean) => string
  }
  style: {
    /**
     * The style to use for the disabled items.
     * @default chalk.dim
     */
    disabled: (text: string) => string
    /**
     * The style to use for the active item.
     * @default chalk.cyan
     */
    active: (text: string) => string
    /**
     * The style to use for the cancel text.
     * @default chalk.red
     */
    cancelText: (text: string) => string
    /**
     * Alias for `emptyText`.
     * @deprecated Use `emptyText` instead. Will be removed in the next major version.
     */
    noFilesFound?: (text: string) => string
    /**
     * The style to use for the empty text.
     * @default chalk.red
     */
    emptyText: (text: string) => string
    /**
     * The style to use for items of type directory.
     * @default chalk.yellow
     */
    directory: (text: string) => string
    /**
     * The style to use for items of type file.
     * @default chalk.white
     */
    file: (text: string) => string
    /**
     * The style to use for the current directory header.
     * @default chalk.magenta
     */
    currentDir: (text: string) => string
    /**
     * The style to use for the key bindings help.
     * @default chalk.white
     */
    help: (text: string) => string
    /**
     * The style to use for the keys in the key bindings help.
     * @default chalk.cyan
     */
    key: (text: string) => string
  }
}
```

## Examples

For examples look in the examples/ directory. You can execute the examples using node.

```shell
cd examples/
node <example-name>.js
```

> [!NOTE]
> Before running the examples, make sure you have installed the dependencies with `npm install` and compiled the project with `npm run build`.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am "feat: my new feature"`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

> [!NOTE]
> The commit message should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## Copyright & License

© 2024 [Brian Fernandez](https://github.com/br14n-sol)

This project is licensed under the MIT license. See the file [LICENSE](LICENSE) for details.