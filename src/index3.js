// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './kreact/index'
import ReactDOM from './kreact/ReactDOM'

import './css/index.scss'

class ClassComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
    }
  }
  bandleClick = () => {
    this.setState({
      counter: this.state.counter + 1,
    })
  }
  render() {
    const { name } = this.props
    const { counter } = this.state
    return (
      <div className="border">
        <p>{name}</p>
        <button onClick={this.bandleClick}>{counter}</button>
        {[1, 2, 3].map((item) => {
          return <FunctionComponent key={item} name={'function组件' + item} />
        })}
      </div>
    )
  }
}
function FunctionComponent(props) {
  return <div className="border">{props.name}</div>
}

const jsx = (
  <div className="box">
    <div className="border">我是文本</div>
    <ClassComponent name="class组件" />
    <FunctionComponent name="function组件" />
  </div>
)

ReactDOM.render(jsx, document.getElementById('root'))
