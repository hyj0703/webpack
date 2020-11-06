import React, { PureComponent } from 'react'
// import { connect } from 'react-redux'
import { connect } from '../kReactRedux'

class Page2 extends PureComponent {
  render() {
    const { counter, add } = this.props
    console.log('props', add)
    return (
      <div>
        App{counter}
        <button onClick={add}>add</button>
      </div>
    )
  }
}
export default connect(
  //mapStateToProps
  (state) => ({ counter: state }),
  //mapDispatchToProps
  { add: () => ({ type: 'add' }) }
)(Page2)
