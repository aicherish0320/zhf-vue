// 都是从安全性考虑 ts 中的兼容性 兼容性是在把一个变量赋值给另一个变量才产生的
// 1. 基本类型的兼容性
let str1!: string | number
let str2!: string | number | boolean
// 少的类型可以赋值给多的
// str1 = str2  // error
str2 = str1
// str2 = str1

// 2. 接口类型兼容 （只要多的类型，可以赋予给少的） 鸭子类型检测
interface I1 {
  fullName: string
  age: number
}
interface I2 {
  fullName: string
  age: number
  address: string
}

let p1!: I1
let p2!: I2
p1 = p2
// p2 = p1 // error

// 3. 函数的兼容性 参数、返回值

let sum1 = (a: string, b: string) => {}
let sum2 = (a: string) => {}

sum1 = sum2 // 定义了a，b，你只用了 c 也是可以的
// sum2 = sum1 // error

// 类的类型 兼容它的检测是符合鸭子检测的
class Person {}

class Animal {}

let person1!: Person
let a1!: Animal

person1 = a1
a1 = person1

// 枚举永远不兼容，泛型是否兼容看最终的结果

// 针对函数的抽象概念，参数是逆变 返回值是协变

class GrandParent {
  house!: string
}

class Parent extends GrandParent {
  money!: string
}
class Son extends Parent {
  play!: string
}

// 参数是逆变
// function getFn(cb: (val: Parent) => void) {}

// getFn((val: GrandParent) => {})
// getFn((val: Parent) => {})
// getFn((val: Son) => {}) // error

// 返回值是协变
// function getFn(cb: (val: Parent) => Parent) {}

// getFn((val: Parent) => new GrandParent()) // error
// getFn((val: Parent) => new Parent())
// getFn((val: Parent) => new Son())

// function getFn1(cb: (val: number | boolean) => void) {}

// getFn1((val: number | boolean | string) => {})
// getFn1((val: number) => {}) // error

export {}
