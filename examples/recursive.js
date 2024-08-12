import select from '@inquirer/select'

import fileSelector from '../dist/index.js'

async function askForFile() {
  let selectedFile = await select({
    message: 'How do you want to proceed?',
    choices: [
      { name: 'Select a file with a file selector', value: 'file-selector' },
      { name: "Exit (I'm done)", value: 'exit' }
    ]
  })

  if (selectedFile === 'file-selector') {
    selectedFile = await fileSelector({
      message: 'Select a file:',
      match: (file) => file.name.endsWith('.json'),
      allowCancel: true
    })
  }

  if (selectedFile === 'canceled') {
    return askForFile()
  }

  return selectedFile
}

(async () => {
  let filePath = await askForFile();
  while (filePath !== 'exit') {
    filePath = await askForFile();
  }
})();