# Theming

inquirer-file-selector supports custom theming to match your application's style.

## Basic Theme Example

You can customize the appearance by providing a theme object:

```javascript
import fileSelector from 'inquirer-file-selector'

const selected = await fileSelector({
  message: 'Select a file:',
  theme: {
    style: {
      currentDir: (text) => `📁 ${text}`,
      answer: (text) => `✅ ${text}`
    }
  }
})
```

## Available Style Properties

The theme object accepts the following style properties:

### Text Styles

| Property | Type | Description |
|----------|------|-------------|
| `message` | `function` | Styles the main prompt message |
| `currentDir` | `function` | Styles the current directory display |
| `answer` | `function` | Styles the final selected answer |
| `cancelText` | `function` | Styles the cancellation message |
| `emptyText` | `function` | Styles the empty directory message |
| `help` | `function` | Styles help text |


## Detailed Theme Example

Theming example:

```javascript
import fileSelector from 'inquirer-file-selector'
import chalk from 'chalk'

const customTheme = {
  style: {
    message: (text) => chalk.bold.cyan(text),
    currentDir: (text) => chalk.gray(`📁 ${text}`),
    answer: (text) => chalk.green(`✅ ${text}`),
    cancelText: (text) => chalk.red(`❌ ${text}`),
    emptyText: (text) => chalk.yellow(text),
    help: (text) => chalk.gray(text)
  },
  help: {
    top: (allowCancel) => allowCancel 
      ? '(Use arrow keys, space to enter directory, enter to select, esc to cancel)'
      : '(Use arrow keys, space to enter directory, enter to select)'
  }
}

const selected = await fileSelector({
  message: 'Choose your file:',
  theme: customTheme
})
```
