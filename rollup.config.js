import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  format: 'cjs',
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
  dest: 'lib/index.js',
  external: [
    'url', 'os', 'path', 'fs', 'child_process',
    'selenium-webdriver',
  ],
  sourceMap: true,
}
