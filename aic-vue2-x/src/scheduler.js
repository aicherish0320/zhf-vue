import { nextTick } from './utils'

// 这里存放要更新的 watcher
let queue = []
// 用来存储已有的 watcher
let has = {}

function flushSchedulerQueue() {
  queue.forEach((w) => w.run())
  queue = []
  has = {}
  pending = false
}

let pending = false

export function queueWatcher(w) {
  const id = w.id
  if (!has[id]) {
    has[id] = true
    queue.push(w)
    // 未等待状态
    if (!pending) {
      // 防抖，多次执行，只走一次
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
