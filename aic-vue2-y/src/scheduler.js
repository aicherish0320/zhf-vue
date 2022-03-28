import { nextTick } from './utils/index'

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  queue.forEach((w) => w.run())
  queue = []
  has = {}
  pending = false
}

export const queueWatcher = (w) => {
  const id = w.id
  if (!has[id]) {
    has[id] = true
    queue.push(w)
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
