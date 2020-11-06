import React, { PureComponent } from 'react'
// import { BrowserRouter, Link, Route } from 'react-router-dom'
import { BrowserRouter, Link, Route } from '../kReactRouterDom'
import HomePage from './HomePage'
import UserPage from './UserPage'

export default class MyReactRouterPage extends PureComponent {
  render() {
    return (
      <div>
        MyReactRouterPage
        <BrowserRouter>
          <Link to="/">首页</Link>
          <Link to="/user">用户中心</Link>
          <Route exact path="/" component={HomePage} />
          <Route path="/user" component={UserPage} />
        </BrowserRouter>
      </div>
    )
  }
}
