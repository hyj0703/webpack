import React from 'react'
import ReactDom from 'react-dom'
// import React from './myReact/index.js'
import DemoHtml from './components/demo/DemoHtml'

function App(props) {
  return <DemoHtml />
}

ReactDom.render(<App title="大前端" />, document.getElementById('root'))
