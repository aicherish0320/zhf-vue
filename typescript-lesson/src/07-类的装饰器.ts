// 类的装饰器（语法糖），用来装饰类
// 类的装饰器 可以装饰类本身 类的属性 类的方法 静态属性

function addSay(target: Function) {
  target.prototype.say = function () {
    console.log('say >>> ')
  }
}

function toUpper(name: string) {
  // console.log(name)
  // key：实例的属性
  return function (target: any, key: string) {
    let val: string
    // target === Person.prototype 类的原型 // true
    // console.log(target, key)
    Object.defineProperty(target, key, {
      get() {
        return val.toUpperCase()
      },
      set(newVal) {
        val = newVal
      }
    })
  }
}

function Enum(flag: boolean) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    desc.enumerable = flag
  }
}
@addSay
class Person {
  say!: Function
  // @toUpper('upper')
  // 实例的属性
  public name: string = 'aicherish'
  // 原型属性
  get myName() {
    return this.name
  }
  // 原型上的方法
  @Enum(false)
  public eat() {
    console.log('eat')
  }
}

const person = new Person()
// person.say
// console.log(person, person.name)
console.log(person)

export {}
