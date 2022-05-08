// ts 中的基本类型，string number boolean tuple array null undefined never
// symbol bigInt void enum
// object 复杂类型 function array
// any 放弃类型检测，尽可能少用，有的情况还是必须要是用的 没有类型提示了
// 自己来创建类型 type 关键字 interface 创建类型
// type 主要是给类型起别名 类型涉及到组合 联合类型
// interface 不能使用联合类型 但是可以继承和实现
// 类类型 描述实例的

// 类型断言(!非空断言，去掉空的情况，null/undefined)
// js 语法 ? 链判断运算符
// ?? 来排除 null undefined 的情况，只要不是 null 和 undefined 都走后面的
// 类似于 false || true

// 函数 进行类型的标识
// 表达式声明、函数声明(function)
// 函数的类型 主要关心参数和返回值 （可选参数 默认值 剩余参数）
// 函数的重载 （参数不同 返回值不同）

// 类 ts 中类的属性 必须要先声明才能使用
// readonly 只能在 constructor 中初始化修改，其他地方不能修改
// ts 支持装饰器（实验性的语法）

// 接口 用来描述对象类型（描述数据的格式），可以描述对象、还可以用来描述函数

// 混合接口（既能描述函数 又能描述属性）
// 在接口里写 void 表示不关心具体返回什么
interface IFn {
  (): void // 描述自己是一个函数
  a: () => void // 描述属性
}

const fn: IFn = () => {}
fn.a = () => {}

// 接口里 也可以使用一些修饰符
// ? 可有可无 readonly 表示接口的属性是仅读的
// 如果接口中数据比预定的多 如何解决（1. 断言成已存在的接口 2. 可以利用兼容性来解决，多的属性
// 可以赋值给少的 3. 接口可以扩展，扩展新的接口来使用 4. 同名的接口可以自行合并（声明文件））

// ts 是具备兼容性的，当我们做赋值操作的时候， ts 会检测这个值是否能兼容当前的类型
// 如果是初始化则要求必须满足这个类型

interface IColor {
  size: number
}

const color1 = {
  size: 1,
  b: 123
}
// 兼容性
const color2: IColor = color1

const color: IColor = {
  size: 10
}

// 接口可以被其他人来实现 可以是类来实现接口

interface Speakable {
  // 规定实例中的属性
  speak: () => void
}

interface SpeakEnglish {
  speakEnglish: () => void
}

class Speak implements Speakable, SpeakEnglish {
  speak() {
    console.log('speak')
  }
  speakEnglish() {
    console.log('speak english')
  }
}

const s = new Speak()

// 抽象类可以包含实现
abstract class Animal {
  // 强调自己不实现 子类来实现 抽象类不能 new
  abstract name: string
  abstract speak(): void
  // 抽象类中可以定义非抽象的方法
  eat() {
    console.log('eat')
  }
}

class Cat extends Animal {
  name: string
  constructor(name: string) {
    super()
    this.name = name
  }
  speak() {
    console.log('speak')
  }
}

const cat = new Cat('tom')

export {}
