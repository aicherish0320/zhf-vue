import { parseHTML } from './parser'

export function compileToFunction(template) {
  // 1. 将模板编程 ast 语法树
  const ast = parseHTML(template)
  // 2. 代码优化 编辑静态节点
  // 3. 代码生成
  const code = generate(ast)
  const render = new Function(`with(this){${code}}`)
  console.log('code >>> ', render.toString(), code)
}

function genProps(attrs) {
  let str = ''
  // { key: value, key: value }
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]

    if (attr.name === 'style') {
      let styles = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1].trim()] = arguments[2].trim()
      })
      attr.value = styles
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(el) {
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  if (el.type === 1) {
    // 如果是元素就递归生成
    return generate(el)
  } else {
    let text = el.text
    // 说明是普通文本
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`
    }
    // <div>aa {{ name }} bb</div>
    // 说明有表达式。需要做一个表达式和普通值的拼接 _v('aaa', _s(name), 'bbb')
    let lastIndex = (defaultTagRE.lastIndex = 0)
    let tokens = []
    let match
    // 如果正则 + g，lastIndex
    while ((match = defaultTagRE.exec(text))) {
      let index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    return `_v(${tokens.join('+')})`
  }
}

function genChildren(el) {
  let children = el.children
  if (children) {
    return children.map((item) => gen(item)).join(',')
  }
  return false
}

function generate(ast) {
  let children = genChildren(ast)
  let code = `_c('${ast.tag}', ${
    ast.attrs.length ? genProps(ast.attrs) : undefined
  }${children ? `,${children}` : ''})`

  return code
}
