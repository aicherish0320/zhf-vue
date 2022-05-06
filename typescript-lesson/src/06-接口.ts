// 接口在开发中被大量使用
// 接口可以用来描述对象的形状，来规定对象中的字段

// type Sum = (a: string, b: string) => string

// type Sum2 =
//   | ((a: string, b: string) => string)
//   | ((a: number, b: number) => number)

// interface Sum {
//   (a: string, b: string): string
// }

// const sum: Sum = (a: string, b: string) => a + b

// interface IArgs {
//   a: string
//   b: string
// }

// const sum = ({ a, b }: IArgs) => a + b

// 混合类型 函数可以当成函数 也可以当成引用类型
// interface ICounter {
//   // 没有具体的实现，如果给具体的值会认为它是一个字面量类型，没有具体实现的就叫成抽象的
//   count: number
//   (): number
// }

// const counter: ICounter = () => {
//   return ++counter.count
// }
// counter.count = 0
// counter()

// 描述对象
interface IFruit {
  color: string
  taste: string
  size: number
  // [key: string]: any
}
const fruit: IFruit = {
  color: 'red',
  taste: 'sweet',
  size: 10
}

interface MyFruit extends IFruit {
  a: number
}

const fruit2: MyFruit = {
  color: 'red',
  taste: 'sweet',
  size: 10,
  a: 123
}

interface IFru {
  a: number
}

const fruit3: IFruit & IFru = {
  color: 'red',
  taste: 'sweet',
  size: 10,
  a: 123
}

// 同名的接口会进行合并 合并成一个接口

// fruit.color

export {}
