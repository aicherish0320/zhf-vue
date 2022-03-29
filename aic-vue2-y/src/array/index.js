const arrayPrototype = Array.prototype

export const arrayProto = Object.create(arrayPrototype)

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'splice',
  'slice',
  'reverse'
]

methods.forEach((m) => {
  arrayProto[m] = function (...args) {
    console.log('拦截数组')
    arrayPrototype[m].call(this, ...args)

    let inserted

    switch (m) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    let ob = this.__ob__
    if (inserted) {
      ob.observeArray(inserted)
    }
    ob.dep.notify()
  }
})
