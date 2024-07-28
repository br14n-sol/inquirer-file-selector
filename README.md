<h1 align="center">
  inquirer-file-selector
</h1>

<p align="center">
  <b>An file selector prompt implementation for <a href="https://github.com/SBoudrias/Inquirer.js">Inquirer.js</a>.</b>
</p>

<div align="center">

  ![license](https://img.shields.io/npm/l/inquirer-file-selector)
  ![node-current](https://img.shields.io/node/v/inquirer-file-selector?color=darkgreen)
  ![version](https://img.shields.io/npm/v/inquirer-file-selector?color=orange)
  ![unpacked-size](https://img.shields.io/npm/unpacked-size/inquirer-file-selector)
  ![downloads](https://img.shields.io/npm/dt/inquirer-file-selector.svg)

</div>

![preview](https://github.com/br14n-sol/inquirer-file-selector/blob/main/preview.gif?raw=true)

## Installation

```shell
npm install inquirer-file-selector
```

## Usage

```ts
import fileSelector from 'inquirer-file-selector'

const filePath = await fileSelector({
  message: 'Select a file',
  ...
})
```

## Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| message | `string` | ✔ | The message to display in the prompt. |
| path | `string` | | The path to the directory where it will be started.<br/> **Default**: `process.cwd()` |
| pageSize | `number` | | The maximum number of items to display in the list.<br/> **Default**: `10` |
| extensions | `string[]` | | The extensions to filter the files.<br/> **Default**: `[]` |

## Copyright & License

© 2024 [Brian Fernandez](https://github.com/br14n-sol)

This project is licensed under the MIT license. See the file [LICENSE](LICENSE) for details.