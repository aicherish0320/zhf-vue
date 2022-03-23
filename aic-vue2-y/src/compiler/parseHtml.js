const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 匹配标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结束 </aa>
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const startTagClose = /^\s*(\/?)>/ // 匹配结束标签 > />

function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag,
    attrs,
    children: [],
    parent
  }
}

export function parseHTML(html) {
  let root
  let stack = []
  function start(tag, attrs) {
    let parent = stack[stack.length - 1]
    const element = createASTElement(tag, attrs, parent)
    stack.push(element)
    if (!root) {
      root = element
    }
    if (parent) {
      parent.children.push(element)
      element.parent = parent
    }
  }
  function end(tag) {
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
    // 开始标签
    let index = html.indexOf('<')
    if (index === 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tag, startTagMatch.attrs)
        continue
      }

      let endTagMatch
      if ((endTagMatch = html.match(endTag))) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (index > 0) {
      let chars = html.substring(0, index)
      advance(chars.length)
      text(chars)
    }
  }

  function advance(len) {
    html = html.substring(len)
  }

  function parseStartTag() {
    let match = html.match(startTagOpen)
    // 有可能匹配的是 </>
    if (match) {
      const startMatch = {
        tag: '',
        attrs: []
      }
      advance(match[0].length)
      startMatch.tag = match[1]

      let attrMatch, endMatch
      while (
        !(endMatch = html.match(startTagClose)) &&
        (attrMatch = html.match(attribute))
      ) {
        advance(attrMatch[0].length)
        startMatch.attrs.push({
          name: attrMatch[1],
          value: attrMatch[3] || attrMatch[4] || attrMatch[5]
        })
      }
      if (endMatch) {
        advance(endMatch[0].length)
      }
      return startMatch
    } else {
      return false
    }
  }
  return root
}
