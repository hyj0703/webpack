function createElement(type, props, ...children) {
  //   delete props.__source
  //   delete props.__self
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child)
      }),
    },
  }
}
function createTextElement(text) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function render(vdom, container) {
  //跟fiber调度逻辑相关的
  //   container.innerHTML = '<pre>' + JSON.stringify(vdom, null, 2) + '</pre>'
  wipRoot = {
    dom: container,
    props: {
      children: [vdom],
    },
    base: currentRoot,
  }
  //vdom需要重新构建一下成fiber
  nextUnitOfWork = wipRoot
  //就算启动了
}
function commitRoot() {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}
//@todo diff后，提交修改
function commitWork(fiber) {
  if (!fiber) return
  //这次是找effectTag，之前这个diff工作，已经统计哪些dom需要修改
  //这里只是实际修改一下
  let domParentFiber = fiber.parent
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.base.props, fiber.props)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
//调度
//开始任务=null
//fiber任务变成了一个链表，我们记住当前要做的任务即可
//通过当前任务，指向下一个
// working in progress
let nextUnitOfWork = null
let wipRoot = null //当前工作fiber的根节点
let currentRoot = null
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    //获取下一个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork && wipRoot) {
    //
    //执行我们的修改 提交修改 比如dom修改 diff结束
    commitRoot()
  }
  window.requestIdleCallback(workLoop)
}
window.requestIdleCallback(workLoop)
//下一个单元任务
//把fiber记录下来，performUntOfWork就可以直接启动
function performUnitOfWork(fiber) {
  //根据当前任务，计算diff 返回下一个任务(子兄父)
  const isFuncCompoent = fiber.type instanceof Function
  if (isFuncCompoent) {
    //更新函数组件
    updateFuncComponent(fiber)
  } else {
    //更新dom标签
    updateHostComponent(fiber)
  }
  if (fiber.child) {
    return fiber.child
  }
  //child->slibling->slibling链表
  let newFiber = fiber
  while (newFiber) {
    if (newFiber.sibling) {
      return newFiber.sibling
    }
    //如果没有兄弟元素了，返回父元素查找
    newFiber = newFiber.parent
  }
}
let wipFiber = null
let hookIndex = null
//更新函数组件
function updateFuncComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = [] //存储hooks的地方
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
//更新宿主，或者说是dom标签
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
function reconcileChildren(fiber, elements) {
  let index = 0
  let oldFiber = fiber.base && fiber.base.child
  let prevSibling = null
  while (index < elements.length || oldFiber != null) {
    let element = elements[index]
    let newFiber = null
    //对比新老元素
    const sameType = oldFiber && element && oldFiber.type === element.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        base: oldFiber,
        effectTag: 'UPDATE',
      }
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        base: null,
        effectTag: 'PLACEMENT',
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber //单纯为了缓存
    index++
  }
}
//实际dom的操作辅助函数，根据fiber创建dom
function createDom(vdom) {
  const dom =
    vdom.type === 'TEXT'
      ? document.createTextNode('')
      : document.createElement(vdom.type)
  updateDom(dom, {}, vdom.props)
  return dom
}
//设置dom的属性
function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter((name) => name !== 'children')
    .filter((name) => !(name in nextProps))
    .forEach((name) => {
      if (name.slice(0, 2) === 'on') {
        dom.removeEventListener(
          name.slice(2).toLowerCase(),
          prevProps[name],
          false
        )
      } else {
        dom[name] = ''
      }
    })
  Object.keys(nextProps)
    .filter((name) => name !== 'children')
    .forEach((name) => {
      if (name.slice(0, 2) === 'on') {
        dom.addEventListener(
          name.slice(2).toLowerCase(),
          nextProps[name],
          false
        )
      } else {
        dom[name] = nextProps[name]
      }
    })
}
//状态修改
//vdom=>fiber的转变
function useState(init) {
  //启动任务队列
  //初始化开始任务
  const oldHook =
    wipFiber.base && wipFiber.base.hooks && wipFiber.base.hooks[hookIndex]

  const hook = {
    state: oldHook ? oldHook.state : init,
    queue: [],
  }
  const actions = oldHook ? oldHook.queue : []
  actions.forEach((action) => {
    hook.state = action
  })
  const setState = (action) => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      base: currentRoot,
    }
    //通过nextUnitWork启动任务
    nextUnitOfWork = wipRoot
  }
  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}
//fiber遍历的过程
//更新组件
//react16是hooks和fiber的天下
export default {
  createElement,
  render,
  useState,
}
