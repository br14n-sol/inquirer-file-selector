# Examples

This page demonstrates various usage patterns for inquirer-file-selector. You can find working example files in the `/examples` directory.

## Running the Examples

To run the example files:

```bash
node examples/basic-usage.js
node examples/filter-by-type.js
node examples/different-directory.js
```

## Basic Selection

The simplest way to use the file selector:

```javascript
import fileSelector from 'inquirer-file-selector'

const selectedPath = await fileSelector({
  message: 'Select a file:'
})

console.log(selectedPath) // Returns path as string
```

## Filtering Files

### Filter by Extension

Filter to show only specific file types:

```javascript
const jsFile = await fileSelector({
  message: 'Select a JavaScript file:',
  type: 'file',
  filter: (item) => {
    if (item.isDirectory) return true // Allow directory navigation
    return item.name.endsWith('.js')
  }
})
```

### Multiple Extensions

Support multiple file extensions:

```javascript
import { extname } from 'node:path'

const codeFile = await fileSelector({
  message: 'Select a code file:',
  type: 'file',
  filter: (item) => {
    if (item.isDirectory) return true
    const ext = extname(item.name).toLowerCase()
    return ['.js', '.ts', '.jsx', '.tsx'].includes(ext)
  }
})
```

### Show Excluded Files

Display filtered files but disable selection:

```javascript
const imageFile = await fileSelector({
  message: 'Choose an image:',
  type: 'file',
  showExcluded: true, // Show but disable non-matching files
  filter: (item) => {
    if (item.isDirectory) return true
    const ext = extname(item.name).toLowerCase()
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)
  }
})
```

## Directory Options

### Start in Different Directory

```javascript
// Start in parent directory
const file = await fileSelector({
  message: 'Select from parent:',
  basePath: '../'
})

// Start in specific subdirectory
const srcFile = await fileSelector({
  message: 'Select from src:',
  basePath: './src'
})
```

### Directory-Only Selection

```javascript
const directory = await fileSelector({
  message: 'Choose a folder:',
  type: 'directory' // Only allow directory selection
})
```

### Both Files and Directories

```javascript
const item = await fileSelector({
  message: 'Select file or folder:',
  type: 'file+directory' // Allow both types
})
```

## Advanced Options

### Enable Looping Navigation

```javascript
const file = await fileSelector({
  message: 'Select (with loop):',
  loop: true // Loop from last to first item
})
```

### Custom Page Size

```javascript
const file = await fileSelector({
  message: 'Select:',
  pageSize: 20 // Show more items at once
})
```

### Allow Cancellation

```javascript
const file = await fileSelector({
  message: 'Select (ESC to cancel):',
  allowCancel: true,
  cancelText: 'Selection cancelled!'
})
```

## Combining Options

Combine multiple options for complex scenarios:

```javascript
const sourceFile = await fileSelector({
  message: 'Select a source file:',
  basePath: './src',
  type: 'file',
  pageSize: 15,
  loop: true,
  allowCancel: true,
  filter: (item) => {
    if (item.isDirectory) return true
    const ext = extname(item.name)
    return ['.js', '.ts'].includes(ext) && !item.name.startsWith('.')
  },
  theme: {
    style: {
      currentDir: (text) => `📁 ${text}`,
      answer: (text) => `✅ ${text}`
    }
  }
})
```

## Example Files

The `/examples` directory contains three complete example files:

1. **`basic-usage.js`** - Simple file selection with Node.js fs integration
2. **`filter-by-type.js`** - Various filtering techniques
3. **`different-directory.js`** - Directory navigation and theming

Each example is self-contained and runnable. They demonstrate real-world usage patterns and can serve as templates for your own implementations.
