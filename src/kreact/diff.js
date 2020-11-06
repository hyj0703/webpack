import { initVnode } from './virtual-dom'

export function diff(cache, newVnode) {
  const { vnode, parentNode, node } = cache
  const newNode = initVnode(newVnode, parentNode)
  parentNode.replaceChild(newNode, node)
  return newNode
}
