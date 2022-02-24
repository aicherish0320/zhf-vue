export function compileToFunction(el) {
  // template -> ast -> render
  parseHTML(el)
}

/*

<div id="app">
  <p>{{ foo }}</p>
</div>

{
  tag: id,
  attrs: {},
  children: {

  }
}

*/

function parseHTML(html) {
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 匹配标签名
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签名
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结束 </aa>
  const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
  const startTagClose = /^\s*(\/?)>/ // 匹配结束标签 > />

  let stack = []
  let root = null

  function createASTElement(tag, attrs, parent = null) {
    return {
      tag,
      type: 1,
      children: [],
      parent,
      attrs
    }
  }

  function start(tag, attrs) {
    const parent = stack[stack.length - 1]
    const element = createASTElement(tag, attrs, parent)
    if (!root) {
      root = element
    }
    if (parent) {
      element.parent = parent
      parent.children.push(element)
    }
    stack.push(element)
  }
  function text(text) {
    const parent = stack[stack.length - 1]
    text = text.replace(/\s/g, '')
    if (text) {
      parent.children.push({
        type: 2,
        text
      })
    }
  }
  function end(tag) {
    stack.pop()
  }

  while (html) {
    let index = html.indexOf('<')
    if (index === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      let endTagMatch
      if ((endTagMatch = html.match(endTag))) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    // 文本
    if (index > 0) {
      let chars = html.substring(0, index)
      text(chars)
      advance(chars.length)
    }
  }

  function parseStartTag() {
    const startMatch = html.match(startTagOpen)
    if (startMatch) {
      const match = {
        tagName: startMatch[1],
        attrs: []
      }
      advance(startMatch[0].length)
      // 匹配属性
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[4]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  function advance(len) {
    html = html.substring(len)
  }

  console.log(root)
}
