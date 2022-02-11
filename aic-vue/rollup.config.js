import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    file: 'dist/vue.js',
    format: 'umd',
    name: 'Vue', // umd 模块需要配置 name，会将导出的模块放到 window 上
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
