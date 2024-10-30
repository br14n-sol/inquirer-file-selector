import select, { Separator } from '@inquirer/select'
import fileSelector from '../dist/index.js'

async function promptForPathSelection() {
  let selectedOption = await select({
    message: 'How do you want to select the path?',
    choices: [
      { name: 'File Selector', value: 'file-selector' },
      // ... other options
      new Separator(),
      { name: "Exit", value: 'exit' }
    ]
  })

  if (selectedOption === 'file-selector') {
    selectedOption = await fileSelector({
      message: 'Select a file:',
      filter: (file) => file.isDirectory() || file.name.endsWith('.json'),
      allowCancel: true
    })
  }

  if (selectedOption === 'canceled') {
    return promptForPathSelection()
  }

  return selectedOption
}

(async () => {
  let chosenPath = await promptForPathSelection()
  while (chosenPath !== 'exit') {
    chosenPath = await promptForPathSelection()
  }
})()