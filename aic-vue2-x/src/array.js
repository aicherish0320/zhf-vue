/*
  数组的响应式处理是通过拦截数组方法处理的
  因为开发者操作数组，在大多数时候，是通过数组方法进行的
*/

const oldArrayPrototype = Array.prototype

export const arrayPrototype = Object.create(oldArrayPrototype)

const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']
// 属性的查找规则是：先在自身查找，自身没有再去原型链上查找
methods.forEach((m) => {
  arrayPrototype[m] = function (...args) {
    console.log('数组更新')
    let inserted

    switch (m) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        // arr.splice(0, 2, 200, 100)
        inserted = args.slice(2)
        break
      default:
        break
    }

    const ob = this.__ob__
    if (inserted) {
      ob.observerArray(inserted)
    }

    oldArrayPrototype[m].call(this, ...args)
  }
})
