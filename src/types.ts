export type Choice = {
  value: string
  path: string
  isDir: boolean
  disabled?: boolean
}

export type FileSelectorConfig = {
  message: string
  /**
   * The path to the directory where it will be started.
   * Default: process.cwd()
   */
  path?: string
  /**
   * The maximum number of items to display in the list.
   * Default: 10
   */
  pageSize?: number
  /**
   * The extensions to filter the files.
   * Default: []
   */
  extensions?: string[]
}
