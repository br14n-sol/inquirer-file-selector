import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import nodeExternals from 'rollup-plugin-node-externals'
import tsConfigPaths from 'rollup-plugin-tsconfig-paths'

import pkg from './package.json' with { type: 'json' }

const { main, types } = pkg

const bundle = (options: RollupOptions): RollupOptions => ({
  ...options,
  input: 'src/index.ts'
})

export default [
  bundle({
    output: {
      file: main,
      format: 'esm'
    },
    plugins: [nodeExternals(), nodeResolve(), typescript(), terser()]
  }),
  bundle({
    output: {
      file: types,
      format: 'esm'
    },
    plugins: [nodeExternals(), tsConfigPaths(), nodeResolve(), dts()]
  })
]
