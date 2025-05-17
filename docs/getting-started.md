# Getting Started

This guide will help you get started with inquirer-file-selector.

## Installation

<table>
  <thead>
    <tr>
      <th>pnpm (recommended)</th>
      <th>npm</th>
    </tr>
  </thead>
  <tbody>
  <tr>
  <td>

```sh
pnpm add inquirer-file-selector
```

  </td>
  <td>

```sh
npm install inquirer-file-selector
```

  </td>
  </tr>
  </tbody>
</table>

## Basic Usage

The simplest way to use inquirer-file-selector is with just a message:

```javascript
import fileSelector from 'inquirer-file-selector'

const selectedPath = await fileSelector({
  message: 'Select a file:'
})

console.log(selectedPath) // Returns path as string
```

## Navigation Keys

- **↑/↓**: Navigate through the list
- **Space**: Enter a directory
- **Enter**: Select the current item
- **Backspace**: Go to parent directory
- **Escape**: Cancel selection (if `allowCancel` is true)

## Configuration Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | Required | The prompt message displayed to the user |
| `basePath` | `string` | `process.cwd()` | Initial directory to start browsing from |
| `type` | `string` | `undefined` | Restrict selection to `'file'`, `'directory'`, or `'file+directory'` |
| `pageSize` | `number` | `10` | Number of items to display at once |
| `loop` | `boolean` | `false` | Enable looping from last to first item |

### Advanced Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filter` | `function` | `undefined` | Function to filter which items are selectable |
| `showExcluded` | `boolean` | `false` | Show excluded items but disable them |
| `allowCancel` | `boolean` | `false` | Allow canceling with ESC key |
| `cancelText` | `string` | `'Canceled.'` | Message shown when selection is cancelled |
| `emptyText` | `string` | `'Directory is empty.'` | Message shown for empty directories |

## Return Values

The return value depends on the usage:
- **Basic usage**: Returns the selected path as a string
- **With filter**: Returns an object with file properties including `path`, `name`, `isDirectory`
- **With type**: Behavior varies based on the specific implementation

## Next Steps

- Check out the [Examples](./examples.md) for more detailed usage patterns
- Learn about [Theming](./theming.md) to customize the appearance
- Explore the example files in the `/examples` directory