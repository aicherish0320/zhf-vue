const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parserHTML(html) {
  let root
  const stack = []
  function createASTElement(tag, attrs, parent) {
    return {
      tag,
      type: 1,
      attrs,
      children: [],
      parent
    }
  }
  function start(tagName, attrs) {
    const parent = stack[stack.length - 1]
    const element = createASTElement(tagName, attrs, parent)
    if (!root) {
      root = element
    }
    if (parent) {
      element.parent = parent
      parent.children.push(element)
    }
    stack.push(element)
  }
  function end(tagName) {
    stack.pop()
  }
  function text(chars) {
    const parent = stack[stack.length - 1]
    chars = chars.replace(/\s/g, '')
    if (chars) {
      parent.children.push({
        type: 2,
        text: chars
      })
    }
  }

  while (html) {
    // 解析标签和文本
    let index = html.indexOf('<')
    if (index === 0) {
      // 开始 < <div> </p>
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        //  开始标签
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch
      if ((endTagMatch = html.match(endTag))) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        // 结束标签
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
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const startMatch = html.match(startTagOpen)
    if (startMatch) {
      const match = {
        tagName: startMatch[1],
        attrs: []
      }
      advance(startMatch[0].length)
      // 有属性、不能为开始的结束标签 </div>
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
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

  return root
}
