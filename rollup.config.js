import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    resolve({
      main: true,
      jsnext: true,
      preferBuiltins: false,
    }),

    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: [
    'url', 'os', 'path', 'fs', 'child_process',
    'selenium-webdriver',
  ],
}
