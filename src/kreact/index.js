import { diff } from './diff'
function createElement(type, props, ...children) {
  //构建成树状图
  if (!props) props = {}
  props.children = children
  let vtype
  if (typeof type === 'string') {
    //原生标签
    vtype = 1
  } else if (typeof type === 'function') {
    //class 2 或者function3
    vtype = type.isReactComponent ? 2 : 3
  }
  //返回一个vnode
  return {
    type,
    vtype,
    props,
  }
}
class Component {
  static isReactComponent = {}
  constructor(props) {
    this.props = props
    this.$cache = {}
    this.state = {}
  }
  setState = (nextState, callback) => {
    this.state = {
      ...this.state,
      ...nextState,
    }
    this.forceUpdate()
    console.log('state', this.state)
  }
  forceUpdate = () => {
    const { $cache: cache } = this
    const newVnode = this.render()
    const newNode = diff(cache, newVnode)
    this.$cache = {
      ...cache,
      vnode: newVnode,
      node: newNode,
    }
  }
}
const React = { createElement, Component }
export default React
