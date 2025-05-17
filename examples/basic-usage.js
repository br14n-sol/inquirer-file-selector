#!/usr/bin/env node

// Basic usage example for inquirer-file-selector
// This demonstrates the simplest way to use the file selector

import fileSelector from 'inquirer-file-selector'
import { statSync } from "node:fs";
import { basename, dirname } from "node:path";

async function selectFile() {
  console.log('Welcome to the basic file selector example!\n')

  try {
    // Basic usage with just a message
    const selected = await fileSelector({
      message: 'Select a file:'
    })

    // The result contains information about the selected file
    const fileInfo = statSync(selected);
    console.log('\nYou selected:')
    console.log(`  Path: ${dirname(selected)}`)
    console.log(`  Name: ${basename(selected)}`)
    console.log(`  Is Directory: ${fileInfo.isDirectory()}`)

    if (!selected.isDirectory) {
      console.log(`  Size: ${fileInfo.size} bytes`)
    }
  } catch (error) {
    console.error('Selection was cancelled or an error occurred:', error)
  }
}

// Run the example
selectFile()
