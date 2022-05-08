// interface 任意接口
interface IColor {
  // string 可以兼容所有的类型
  [x: string]: number
}

const color: IColor = {
  a: 1
}
// 泛型的特点 就是解决在定义到时候不能明确类型 只能在使用的时候才能明确类型
interface IArr<T> {
  // 限制 Key 只能是 number
  // 数组的 key 只能是 number 类型，后面的表示是 key 对应的值
  [x: number]: T
}

// 使用泛型的时候 传递的参数是实参 定义的时候使用的泛型是形参

// const arr: IArr = {
//   1: 1
//   // a: 1 // error
// }

const arr2: Array<number> = [1, 2, 3] // [n: number]: T;
// const arr3: number[] = [1, 2]
// const arr4: Array<string> = ['a', 'b']
const arr5: IArr<string> = ['a', 'b']
const arr6: IArr<number> = [1, 2]

export {}
