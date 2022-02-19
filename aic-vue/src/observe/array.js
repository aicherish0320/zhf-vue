// 获取数组的老的原型方法
const oldArrayPrototype = Array.prototype
// 让 arrayMethods 通过 __proto__ 能获取到数组的方法
export const arrayMethods = Object.create(oldArrayPrototype)
// 只有这7个方法可以导致数组发生变化
const methods = ['push', 'pop', 'unshift', 'reverse', 'sort', 'splice', 'shift']

methods.forEach((method) => {
  // 属性的查找，是先找自己身上的，找不到去原型上查找
  arrayMethods[method] = function () {
    console.log('数组的方法进行重写操作')
  }
})
