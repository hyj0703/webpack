import React, { PureComponent } from 'react'
import { connect } from '../kReactRedux'
import { Redirect } from 'react-router-dom'

class loginPage extends PureComponent {
  render() {
    const { isLogin, login, location } = this.props
    const { redirect = '/' } = location.state || {}
    if (isLogin) {
      return <Redirect to={redirect} />
    }
    return (
      <div>
        login
        <button onClick={login}>登录</button>
      </div>
    )
  }
}

export default connect((state) => ({ isLogin: state.isLogin }), {
  login: () => ({ type: 'loginsuccess' }),
})(loginPage)
