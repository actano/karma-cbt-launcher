import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**', // only transpile our source code
    }),
    commonjs(),
    resolve({
      main: true,
      jsnext: true,
    }),
  ],
  dest: 'lib/index.js',
  external: ['selenium-webdriver', 'cbt_tunnels'],
}
