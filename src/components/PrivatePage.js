import React, { PureComponent } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from '../kReactRedux'

class PrivatePage extends PureComponent {
  render() {
    const { path, component, isLogin, login } = this.props
    if (isLogin) {
      return <Route path={path} component={component} />
    }
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { redirect: path },
        }}
      />
    )
    
  }
}

export default connect((state) => ({ isLogin: state.isLogin }))(PrivatePage)
