// 获取数组的老的原型方法
const oldArrayPrototype = Array.prototype
// 让 arrayMethods 通过 __proto__ 能获取到数组的方法
export const arrayMethods = Object.create(oldArrayPrototype)
// 只有这7个方法可以导致数组发生变化
const methods = ['push', 'pop', 'unshift', 'reverse', 'sort', 'splice', 'shift']

methods.forEach((method) => {
  // 属性的查找，是先找自己身上的，找不到去原型上查找
  arrayMethods[method] = function (...args) {
    // 数组新增的属性 要看一下是不是对象 如果是对象 则继续进行劫持
    // 需要调用数组原生逻辑
    oldArrayPrototype[method].call(this, ...args)
    // TODO... 可以添加自己的逻辑 函数劫持 切片
    let inserted = null
    let ob = this.__ob__
    switch (method) {
      // 修改 删除 添加
      case 'splice':
        inserted = args.slice(2) // splice 方法从第三个参数起 是添加的新数据
        break
      case 'push':
      case 'unshift':
        // 调用 push/unshift 传递的参数就是新增的逻辑
        inserted = args
        break
    }
    // inserted 遍历数组，看一个它是否需要进行再次劫持
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
  }
})
