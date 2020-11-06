export function initVnode(vnode, container) {
  let node = null
  const { vtype } = vnode
  if (!vtype) {
    node = initTxtNode(vnode, container)
  }
  if (vtype === 1) {
    //原生标签
    node = initHtmlNode(vnode, container)
  }
  if (vtype === 2) {
    //class组件
    node = initClassComponent(vnode, container)
  }
  if (vtype === 3) {
    //function 组件
    node = initFunctionComponent(vnode, container)
  }
  return node
}
function initTxtNode(vnode, container) {
  const node = document.createTextNode(vnode)
  return node
}
function initHtmlNode(vnode, container) {
  const { type, props } = vnode
  const node = document.createElement(type)
  const { children, ...rest } = props || {}
  //   console.log('children', children, props)
  children &&
    children.map((item) => {
      console.log('itme', item)
      node.appendChild(initVnode(item, node))
    })
  Object.keys(rest).map((key) => {
    if (key === 'className') {
      node.setAttribute('class', rest[key])
    }
  })
  return node
}
function initFunctionComponent(vnode, container) {
  const { type, props } = vnode
  const vvnode = type(props)
  return initVnode(vvnode, container)
}
function initClassComponent(vnode, container) {
  const { type, props } = vnode
  const cmp = new type(props)
  const vvnode = cmp.render()
  return initVnode(vvnode, container)
}
