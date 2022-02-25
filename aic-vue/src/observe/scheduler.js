import { nextTick } from '../utils'

// 这里存放要更新的 watcher
let queue = []
// 用来存放已有的 watcher 的 id
let has = {}

let pending = false

function flushSchedulerQueue() {
  queue.forEach((watcher) => watcher.run())
  queue = []
  has = {}
  pending = false
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)

    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
