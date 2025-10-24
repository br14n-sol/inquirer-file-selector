# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- 

### Changed

- 

### Deprecated

- 

### Removed

- 

### Fixed

- 

### Security

- 

## [0.4.0] 2024-08-20

### Added

- `config.basePath` to supersede `config.path`. Works the same.
- `config.cancelText` to supersede `config.canceledLabel` and add missing theme option `theme.cancelText`. Works the same.
- `config.emptyText` to supersede `config.noFilesFound` and `theme.emptyText` to supersede `theme.noFilesFound`. Works the same.

### Changed

- Compact help tip lines to take up less space on the terminal screen.

### Deprecated

- `config.path` is deprecated and will be removed in version 0.5.0.
- `config.canceledLabel` is deprecated and will be removed in version 0.5.0.
- `config.noFilesFound` and `theme.noFilesFound` are deprecated and will be removed in version 0.5.0.

### Removed

- Previously deprecated `config.extensions`.

### Fixed

- In node versions >= 18 and < 18.20.0, `dirent.parentPath` does not exist.

## [0.3.1] 2024-08-11

### Fixed

- Loss of focus on the active item occurs when `config.hideNonMatch` is `false` and the first item in the list is disabled.

## [0.3.0] 2024-08-08

### Added

- `config.match` to extends filtering capabilities, superseding `config.extensions`. Works like `[].filter`.
- `config.hideNonMatch` boolean to hide files that do not match `config.extensions` or `config.match`. Defaults to `false`.
- `config.allowCancel` boolean to allow canceling the selection by pressing the `Esc` key. Returns the string `'canceled'`. Defaults to `false`.

### Changed

- Update `@inquirer/core` to version 9.0.10.
- Navigate to parent directory with `Backspace` key instead of `Esc`.

### Deprecated

- `config.extensions` is deprecated and will be removed in version 0.4.0.

## [0.2.1] 2024-08-04

### Changed

- Update `@inquirer/core` to version 9.0.9.

### Fixed

- Inaccurate types.

## [0.2.0] 2024-07-29

### Added

- Support for custom themes.

### Changed

- Update `@inquirer/core` to version 9.0.6.
- Replace `yoctocolors` with `chalk`.

### Removed

- Supersedes `ansi-escapes` dependency with an internal constant to hide the cursor.

## [0.1.1] 2024-07-28

### Fixed

- If `config.extensions` is an empty array or not provided, all files in the selector are disabled.

## [0.1.0] 2024-07-27

- This is the initial version.