export function initState(vm) {
  const opts = vm.$options

  if(opts.data) {
    initData(vm)
  }
}

// 数据的初始化
function initData(vm) {
  console.log('vm >>> ', vm.$options)
  
}
