import React, { PureComponent } from 'react'
import ReactDom from 'react-dom'

import './css/index.scss'
// import a from './a.js'

console.log('hello webpack')
class App extends PureComponent {
  render() {
    return (
      <div>
        hello world
        <div className="img"></div>
        <div className="pic"></div>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('root'))
