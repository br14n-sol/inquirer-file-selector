import fileSelector from '../dist/index.js'

async function selectFile() {
  await fileSelector({
    message: 'Select a file:',
  })
}

async function selectDirectory() {
  await fileSelector({
    message: 'Select a directory:',
    // match:(item)=> {
    //   show directories only
    //   return item.isDir;
    // },
    // hideNonMatch: true,
    expect: 'directory',
  })
}

async function selectFileOrDirectory() {
  await fileSelector({
    message: 'Select a file or directory:',
    expect: 'both',
  })
}

// await selectFile()
await selectDirectory()
// await selectFileOrDirectory()
