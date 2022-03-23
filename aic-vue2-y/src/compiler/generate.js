function genProps(attrs) {
  if (!attrs) {
    return undefined
  }
  let str = ''
  attrs.forEach((attr) => {

    if(attr.name === 'style') {
      const styles = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styles[arguments[1].trim()] = arguments[2].trim()
      })
      attr.value = styles
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })
  return `{${str.slice(0, -1)}}`
}
function genChildren(children) {
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

    // _v('hello' + _s(name) + 'world')

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

export function generate(ast) {
  return `_c(${ast.tag}, ${genProps(ast.attrs)},${genChildren(ast.children)})`
}
