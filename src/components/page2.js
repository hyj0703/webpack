import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withPromise } from '../utils/reducerAndSaga'

class Page2 extends PureComponent {
  render() {
    const { history } = this.props
    return (
      <div>
        App2
        <button
          onClick={() => {
            history.push('/')
          }}>
          点击跳转
        </button>
      </div>
    )
  }
}
export default connect(
  (state) => state,
  withPromise((dispatch) => {
    return {
      add() {
        dispatch({ type: 'bbb' })
      },
    }
  })
)(Page2)
