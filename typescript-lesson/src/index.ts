//! 联合类型 默认是并集的关系

const elm = document.getElementById('app')
// '!'标识非空断言
elm!.style.color = 'red'
// if (elm) {
//   elm.style.color = 'red'
// }

// ! 类型断言

const el = elm as HTMLElement
el.style.color = 'red'

// ! 字面量类型
type COLOR = 'red' | 'yellow' | 'blue'

const color: COLOR = 'blue'

export {}
