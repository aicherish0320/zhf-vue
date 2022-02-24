const oldArrayPrototype = Array.prototype

export const arrayProto = Object.create(oldArrayPrototype)

const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse']

methods.forEach((m) => {
  arrayProto[m] = function (...args) {
    console.log('劫持数组', m)
    oldArrayPrototype[m].call(this, ...args)

    let inserted
    switch (m) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      const ob = this.__ob__
      ob.observeArray(inserted)
    }
  }
})
