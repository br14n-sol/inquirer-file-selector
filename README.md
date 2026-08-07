# inquirer-file-selector

A file selector prompt for [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) that allows users to interactively select files or directories from the terminal.

## Features

- File and directory selection
- Multi-select support
- Custom filters to show only specific file types
- Restrict back navigation to a specific parent directory
- Cancel selection with a key press (configurable)
- Fully customizable keybinds
- Fully customizable theme

## Installation

```sh
pnpm add inquirer-file-selector
```

## Basic Usage

```ts
import { fileSelector } from 'inquirer-file-selector'

const selection = await fileSelector({
  message: 'Select a file or directory:'
})
console.log(selection)
```

## Advanced Usage

See the full documentation and examples in GitHub [README.md](.github/README.md).

## Copyright & License

© 2024 [Brian Fernandez](https://github.com/br14n-sol) (main maintainer) and contributors.

This project is licensed under the [MIT License](./LICENSE).