// 1. 希望拿到 packages 下的所有包
const fs = require('fs')
const execa = require('execa')

const targets = fs.readdirSync('packages').filter((item) => {
  return fs.statSync(`packages/${item}`).isDirectory()
})

async function build(target) {
  return execa('rollup', ['-c', '--environment', 'TARGET:' + target], {
    stdio: 'inherit'
  })
}

function runAll(targets) {
  const results = []
  for (const target of targets) {
    results.push(build(target))
  }
  // 多个文件夹并行打包
  return Promise.all(results)
}

// 打包这些文件
runAll(targets).then(() => {
  console.log('打包完毕')
})
