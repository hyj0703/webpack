import { initVnode } from './virtual-dom'

function render(vnode, container) {
  //vnode => node
  const node = initVnode(vnode, container)
  //把真实dom节点放到container里面去
  container.appendChild(node)
}
const ReactDOM = {
  render,
}
export default { render }
