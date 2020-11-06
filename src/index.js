// import React from 'react'
// import ReactDom from 'react-dom'
import React from './myReact/index.js'

function App(props) {
  const [count, setCount] = React.useState(1)
  const [title, setTitle] = React.useState(1)
  return (
    <div>
      <h3>{props.title}</h3>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>click</button>
      <h2>{title}</h2>
      <button onClick={() => setTitle(title + 1)}>click</button>
      <div id="demo">
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>
    </div>
  )
}

React.render(<App title="大前端" />, document.getElementById('root'))
