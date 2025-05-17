#!/usr/bin/env node

// File type filtering example for inquirer-file-selector
// This shows how to filter files by extension and type

import fileSelector from 'inquirer-file-selector'
import { extname } from 'node:path'

async function selectJavaScriptFile() {
  console.log('File Type Filtering Example\n')
  console.log('This example shows how to filter files by type.\n')

  try {
    // Example 1: Show only JavaScript and TypeScript files
    console.log('1. Select a JavaScript or TypeScript file:')
    const jsFile = await fileSelector({
      message: 'Choose a JS/TS file:',
      type: 'file', // Only allow file selection, not directories
      filter: (item) => {
        // Allow all directories (for navigation)
        if (item.isDirectory) return true

        // For files, only allow .js, .ts, .jsx, .tsx extensions
        const ext = extname(item.name).toLowerCase()
        return ['.js', '.ts', '.jsx', '.tsx'].includes(ext)
      }
    })

    console.log(`\nSelected: ${jsFile}\n`)

    // Example 2: Show only image files with excluded items visible
    console.log('2. Select an image file (excluded files shown but disabled):')
    const imageFile = await fileSelector({
      message: 'Choose an image:',
      type: 'file',
      showExcluded: true, // Show filtered out files but disable them
      filter: (item) => {
        if (item.isDirectory) return true

        const ext = path.extname(item.name).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)
      }
    })

    console.log(`\nSelected: ${imageFile
    }\n`)

    // Example 3: Select only directories
    console.log('3. Select a directory:')
    const directory = await fileSelector({
      message: 'Choose a folder:',
      type: 'directory'
    })

    console.log(`\nSelected directory: ${directory}`)

  } catch (error) {
    console.error('Selection was cancelled or an error occurred:', error)
  }
}

// Run the example
selectJavaScriptFile()
