const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function generate(ast) {
  const children = genChildren(ast)
  const code = `_c('${ast.tag}',${genProps(ast.attrs)}${
    children ? `,${children}` : ''
  })`

  return code
}

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]

    if (attr.name === 'style') {
      let styles = {}
      attr.value.replace(/([^:;]+):([^:;]+)/g, function () {
        styles[arguments[1]] = arguments[2]
      })
      attr.value = styles
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function genChildren(ast) {
  const children = ast.children
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
  return false
}

function gen(child) {
  if (child.type === 1) {
    return generate(child)
  } else {
    let text = child.text
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`
    }

    let tokens = []
    let lastIndex = (defaultTagRE.lastIndex = 0)

    let match

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