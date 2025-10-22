# How to Contribute

I'm really glad you're reading this! If you're interested in contributing to `inquirer-file-selector`, this guide will help you set up your environment.

## Prerequisites

- **Node.js 20.19.0** (Ensure it's installed: `node -v`)
  - Using a version manager like [fnm](https://github.com/Schniz/fnm) is recommended to easily switch between Node.js versions.
- **pnpm 10.8.1** (Used for managing dependencies)
   - It's recommended to enable [pnpm](https://pnpm.io/) via [corepack](https://github.com/nodejs/corepack):
     ```sh
     corepack enable pnpm
     ```
- **Git** (Required for cloning and contributing)
- A GitHub account to fork and submit pull requests

## Tools Used

This project uses the following tools to maintain code quality and consistency:

- [Biome](https://biomejs.dev/) for formatting and linting
- [husky](https://github.com/typicode/husky) for managing Git hooks
- [nano-staged](https://github.com/usmanyunusov/nano-staged) for running linters on staged files

## Getting Started

1. **Fork the repository** and clone it locally:
   ```sh
   git clone https://github.com/YOUR_USERNAME/inquirer-file-selector.git
   cd inquirer-file-selector
   ```
2. **Install dependencies**:
   ```sh
   pnpm install
   ```
3. **Create a new branch** for your changes:
   ```sh
   git checkout -b my-feature
   ```

## Submitting Changes

1. **Commit your changes** with clear and concise messages:
   ```sh
   git commit -m "Add support for XYZ"
   ```
2. **Push to your fork**:
   ```sh
   git push origin my-feature
   ```
3. **Open a pull request** in the main repository with your changes against the `main` branch.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
