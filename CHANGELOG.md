# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Support `config.allowBack` to optionally prevent navigating back to the parent directory. Thanks to [@JordanW9232](https://github.com/JordanW9232).

### Changed

- Drop support for Node.js 20; now requires Node.js 22.19.0 or newer.
- No longer publishing minified code to enable better stacktrace interpretation during error debugging.
- Update `@inquirer/core` to version 11.2.1.
- Update `@inquirer/figures` to version 2.0.7.
- Update `@inquirer/type` to version 4.0.7.

### Removed

- `chalk` dependency, replaced with Node.js built-in `styleText` utility.
- `PromptConfig.showExcluded` option. Entries excluded by `PromptConfig.filter` are now always hidden, which was previously the default behavior.
- `PromptTheme.style.disabled` style. Disabled entries are no longer rendered.

### Fixed

- Permission denied errors during directory scanning (scandir), complementing previous stat error fixes.

## [1.0.1] 2025-08-10

### Changed

- Version bumped to publish on npm, no functional changes.

## [1.0.0] 2025-08-09 (Could not be published)

### Added

- `config.multiple` boolean to support multiple selection.
- `config.keybinds` to customize all key actions.
- Make all help hints fully customizable on the theme with dynamic display.
- Exports for types: `StatusType`, `PromptConfig`, `Item`, `RawItem`, `ItemTypeUnion`, `PromptTheme`, `RenderHelpContext`, `RenderItemContext` and `Keybinds`.

### Changed

- Move `@inquirer/type` from dev dependency to regular dependency.
- Update `@inquirer/core` to version 10.1.14.
- Update `@inquirer/figures` to version 1.0.12.
- Update `@inquirer/type` to version 3.0.7.
- Enhance prompt signature with conditional return types.
- Return an `Item` object instead of just a path.
- Return `null` instead of `'canceled'` when the prompt is canceled.
- Replace default export with named export `fileSelector`.
- Make files and directories selectable by default.
- Drop support for Node.js 18; now requires Node.js 20.
- Move all logic of rendering items to the theme, and make other small changes.
- Move `config.cancelText` and `config.emptyText` to `theme.labels.messages`.

### Fixed

- Visibility issues in light color schemes.
- Permission-denied errors during stat calls on restricted files. Thanks to [@justind000](https://github.com/justind000).
- Crash occurring on confirming selection in empty directory with `config.type` set to `'file'`. Thanks to [@jrsun](https://github.com/jrsun).

## [0.6.2] 2025-03-01

### Changed

- Update `@inquirer/core` to version 10.1.7.
- Update `@inquirer/figures` to version 1.0.10.
- Update `chalk` to version 5.4.1.

### Fixed

- Wrong symbol in file tree when config option `loop` is `true`.

## [0.6.1] 2024-12-01

### Added

- Support selecting the current directory (`./`) in the explorer when config option `type` is `'directory'` or `'file+directory'`. This allows quicker selection of the current directory. Thanks to [@pastacolsugo](https://github.com/pastacolsugo).

### Changed

- Update `@inquirer/core` to version 10.1.0.
- Update `@inquirer/figures` to version 1.0.8.

## [0.6.0] 2024-10-30

### Added

- Ability to select directories.
- Config option `type` to decide what item type is selectable. This option has three possible values: `'file'`, `'directory'` and `'file+directory'`. Defaults to `'file'`.

### Changed

- Open directories with the `Space` key instead of `Enter`. The `Enter` key now only selects the focused item.
- Update `@inquirer/core` to version 10.0.1.
- Update `@inquirer/figures` to version 1.0.7.

### Removed

- Previously deprecated config options `match` and `hideNonMatch`, and `isDir` property from the `filter` callback.

## [0.5.0] 2024-10-22

### Added

- Config option `filter` to supersede config option `match`. Works similarly, with the added ability to filter directories.
- Config option `showExcluded` to supersede config option `hideNonMatch`. Works in the opposite way.
- Support for a custom prefix based on prompt status.
- Config option `loop` to allow looping through the list of files.

### Changed

- Update `@inquirer/core` to version 9.2.1.
- Update `@inquirer/figures` to version 1.0.6.

### Deprecated

- Config option `match` is deprecated and will be removed in version 0.6.0.
- Config option `hideNonMatch` is deprecated and will be removed in version 0.6.0.
- `isDir` property in the config option `filter` callback is deprecated and will be removed in version 0.6.0. Use `isDirectory()` instead.

### Removed

- Previously deprecated config options `path`, `canceledLabel` and `noFilesFound`, and theme option `noFilesFound`.

## [0.4.0] 2024-08-20

### Added

- Config option `basePath` to supersede config option `path`. Works the same.
- Config option `cancelText` to supersede config option `canceledLabel` and add missing theme option `cancelText`. Works the same.
- Config option `emptyText` to supersede config option `noFilesFound`, and theme option `emptyText` to supersede theme option `noFilesFound`. Works the same.

### Changed

- Compact help tip lines to take up less space on the terminal screen.

### Deprecated

- Config option `path` is deprecated and will be removed in version 0.5.0.
- Config option `canceledLabel` is deprecated and will be removed in version 0.5.0.
- Config option `noFilesFound` and theme option `noFilesFound` are deprecated and will be removed in version 0.5.0.

### Removed

- Previously deprecated config option `extensions`.

### Fixed

- Compatibility issue with Node.js versions >= 18 and < 18.20.0, where `dirent.parentPath` does not exist.

## [0.3.1] 2024-08-11

### Fixed

- Loss of focus on the active item when config option `hideNonMatch` is `false` and the first item in the list is disabled.

## [0.3.0] 2024-08-08

### Added

- Config option `match` to extend filtering capabilities, superseding config option `extensions`. Works like `[].filter`.
- Config option `hideNonMatch` to hide files that do not match config options `extensions` or `match`. Defaults to `false`.
- Config option `allowCancel` to allow canceling the selection by pressing the `Esc` key. Returns the string `'canceled'`. Defaults to `false`.

### Changed

- Navigate to parent directory with `Backspace` key instead of `Esc`.
- Update `@inquirer/core` to version 9.0.10.

### Deprecated

- Config option `extensions` is deprecated and will be removed in version 0.4.0.

## [0.2.1] 2024-08-04

### Changed

- Update `@inquirer/core` to version 9.0.9.

### Fixed

- Incorrect TypeScript type definitions generated during compilation.

## [0.2.0] 2024-07-29

### Added

- Support for custom themes.

### Changed

- Replace `yoctocolors` with `chalk`.
- Update `@inquirer/core` to version 9.0.6.

### Removed

- `ansi-escapes` dependency, replaced with an internal constant to hide the cursor.

## [0.1.1] 2024-07-28

### Fixed

- If config option `extensions` is an empty array or not provided, all files in the selector are disabled.

## [0.1.0] 2024-07-27

- This is the initial version.

[unreleased]: https://github.com/br14n-sol/inquirer-file-selector/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/br14n-sol/inquirer-file-selector/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.6.2...v1.0.0
[0.6.2]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/br14n-sol/inquirer-file-selector/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/br14n-sol/inquirer-file-selector/releases/tag/v0.1.0