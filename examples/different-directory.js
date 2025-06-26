#!/usr/bin/env node

// Different starting directory example for inquirer-file-selector
// This shows how to start the file selector in various directories

import fileSelector from 'inquirer-file-selector'
import path from 'node:path'

async function selectFromDifferentDirectories() {
  console.log('Different Starting Directory Example\n')
  console.log('This example demonstrates starting the file selector in different locations.\n')

  try {
    console.log('1. Starting in parent directory:')
    const selected = await fileSelector({
      message: 'Select a directory or file from your parent directory:',
      basePath: '../',
      pageSize: 15,
      type: "file+directory"
    })

    console.log(`\nSelected: ${selected}\n`)

    // Example 2: Start in a subdirectory with custom navigation
    console.log('2. Starting in a subdirectory with loop navigation:')
    const srcFile = await fileSelector({
      message: 'Navigate and select (with loop enabled):',
      basePath: '../src', // Start in src subdirectory if it exists
      loop: true, // Enable looping from last to first item
      emptyText: 'This directory is empty!', // Custom empty directory message
      type: 'file',
      filter: (item) => {
        // Skip hidden files (starting with .)
        return !item.name.startsWith('.')
      }
    })

    console.log(`\nSelected: ${srcFile.path}\n`)

    // Example 3: Absolute path with custom theme
    console.log('3. Using absolute path with custom styling:')
    const tempFile = await fileSelector({
      message: 'Select from current working directory:',
      basePath: './', // Absolute path
      type: 'file',
      theme: {
        style: {
          currentDir: (text) => `📁 ${text}`,
          answer: (text) => `✅ ${text}`
        }
      }
    })

    console.log(`\nSelected: ${tempFile}`)

  } catch (error) {
    console.error('\nSelection was cancelled or an error occurred:', error)
  }
}

// Run the example
selectFromDifferentDirectories()
