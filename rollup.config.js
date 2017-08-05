import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  dest: 'lib/index.js',
  external: ['url', 'selenium-webdriver', 'cbt_tunnels', 'es6-promisify'],
}
