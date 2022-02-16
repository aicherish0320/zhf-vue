import babel from 'rollup-plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/index.js', // 打包入口
  output: {
    file: 'dist/vue.js',
    format: 'umd', // 输出格式 (IIFE/ESM/CJS)
    name: 'Vue', // umd 模块需要配置 name，会将导出的模块放到 window 上
    sourcemap: true // 可以进行源代码调试
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    nodeResolve()
  ]
}
