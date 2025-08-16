import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import nodeExternals from 'rollup-plugin-node-externals'
import pkg from './package.json' with { type: 'json' }
import tsConfig from './tsconfig.json' with { type: 'json' }

const { main, types } = pkg
const { compilerOptions } = tsConfig

const bundle = (options: RollupOptions): RollupOptions => ({
  ...options,
  input: 'src/index.ts'
})

// biome-ignore lint/style/noDefaultExport: Rollup expects a default export
export default [
  bundle({
    output: {
      file: main,
      format: 'esm'
    },
    plugins: [nodeExternals(), typescript({ removeComments: true })]
  }),
  bundle({
    output: {
      file: types,
      format: 'esm'
    },
    plugins: [dts({ compilerOptions: { paths: compilerOptions.paths } })]
  })
]
