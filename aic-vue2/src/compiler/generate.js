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
function genProps(attrs) {}
