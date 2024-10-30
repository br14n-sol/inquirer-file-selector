import select, { Separator } from '@inquirer/select';
import fileSelector from '../dist/index.js';

async function promptForPathSelection() {
  let selectedOption = await select({
    message: 'What type of selection do you want to try?',
    choices: [
      { name: 'file (default)', value: 'file' },
      { name: 'directory', value: 'directory' },
      { name: 'file+directory', value: 'file+directory' },
      new Separator(),
      { name: "Exit", value: 'exit' },
    ],
  });

  if (selectedOption !== 'exit') {
    selectedOption = await fileSelector({
      message: `Select a path:`,
      type: selectedOption,
      allowCancel: true,
    });
  }

  if (selectedOption === 'canceled') {
    return promptForPathSelection();
  }

  return selectedOption;
}

(async () => {
  let chosenPath = await promptForPathSelection();
  while (chosenPath !== 'exit') {
    chosenPath = await promptForPathSelection();
  }
})();