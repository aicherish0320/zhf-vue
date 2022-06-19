import path from 'path'
// 获取整个 packages 目录
const packagesDir = path.resolve(__dirname, 'packages')
// 根据调用 rollup 时候的参数 来进行动态打包
const packageDir = path.resolve(packagesDir, process.env.TARGET)
// 我需要拿到 package.json 中的内容
const pkg = require(path.resolve(packageDir, 'package.json'))
const options = pkg.buildOptions

export default {
  input: ''
}
