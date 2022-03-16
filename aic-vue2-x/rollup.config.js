import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd', // IIFE ESM CJS UMD
    name: 'Vue', // UMD 模块需要配置 name ，会将导出的模块放在 windows 上
    sourcemap: true
  },
  plugins: [
    babel({
      excludes: 'node_modules/**'
    })
  ]
}
