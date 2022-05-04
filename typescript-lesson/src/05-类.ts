// 类（编译出来的结果也是函数），构造函数的区别
// 构造函数的特点能 new，而且可以调用

// 类中的概念，实例的属性、共享属性、静态属性（类直接调用）、方法

// 类中的 this，默认不知道自己具备什么属性
class Point {
  public x: number
  public y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const p = new Point(1, 1)

class Animal {
  public name: string
  protected height: number
  constructor(name: string, height: number) {
    this.name = name
    this.height = height
  }
}

class Dog extends Animal {
  static color: string
  constructor(name: string, height: number) {
    super(name, height)
    // this.height
  }
}

const d = new Dog('yellow', 1)

// Dog.color

class Cat extends Animal {
  constructor(name: string, height: number, private aName: string) {
    super(name, height)
    // Animal.call(this)
  }
  get newName() {
    return this.aName
  }
  set newName(newVal) {
    this.aName = newVal
  }
}

const cat = new Cat('tom', 120, 'jack')

// cat.newName

// super 在构造函数和静态方法中 super 指向父亲
// super 在原型方法中指代的是父亲的原型

export {}
