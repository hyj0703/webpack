import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

@connect(({ aaa }) => ({ aaa }))
class Page1 extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'aaaa',
      payload: { setValue: '333' },
    })
  }
  render() {
    const { aaa, history } = this.props
    return (
      <div>
        hello world{aaa.value}
        <button
          onClick={() => {
            history.push('/page2')
          }}>
          点击跳转
        </button>
      </div>
    )
  }
}
export default Page1
