import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import nodeExternals from 'rollup-plugin-node-externals'
import pkg from './package.json' with { type: 'json' }
import tsConfig from './tsconfig.json' with { type: 'json' }

const { main, types } = pkg
const { compilerOptions } = tsConfig

// biome-ignore lint/style/noDefaultExport: Rollup expects a default export
export default defineConfig([
  {
    input: 'src/index.ts',
    output: { file: main, format: 'esm' },
    plugins: [nodeExternals(), typescript({ removeComments: true })]
  },
  {
    input: 'src/index.ts',
    output: { file: types, format: 'esm' },
    plugins: [dts({ compilerOptions: { paths: compilerOptions.paths } })]
  }
])
