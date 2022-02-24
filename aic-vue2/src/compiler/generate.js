export function generate(ast) {
  let children = genChildren(ast)
  let code = `_c('${ast.tag}',${
    ast.attrs.length ? genProps(ast.attrs) : undefined
  }${children ? `,${children}` : ''})`
  return code
}

function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
  return false
}
function gen(el) {
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
  if (el.type === 1) {
    return generate(el)
  } else {
    const text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v('${text}')`
    }
    // 如果正则 + g，配合 exec 就会有一个问题 lastIndex
    let lastIndex = (defaultTagRE.lastIndex = 0)
    let match,
      tokens = []
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
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      const styles = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1].trim()] = arguments[2].trim()
      })
      attr.value = styles
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
