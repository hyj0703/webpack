import React, { PureComponent } from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import HomePage from './HomePage'
import UserPage from './UserPage'
import PrivatePage from './PrivatePage'
import LoginPage from './LoginPage'

function Detail(props) {
  return <div>Detail</div>
}
function Search(props) {
  const { id } = props.match.params
  return (
    <div>
      <p>Search{id}</p>
      <Link to={'/search/' + id + '/detail'}>{id}的详情</Link>
      <Route path={'/search/' + id + '/detail'} component={Detail} />
    </div>
  )
}
export default class ReactRouterPage extends PureComponent {
  render() {
    const searchId = 123
    return (
      <div>
        <h3>ReactRouterPage</h3>
        <BrowserRouter>
          <Link to="/">首页</Link>
          <Link to="/user">用户中心</Link>
          <Link to={'/search/' + searchId}>搜索</Link>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <PrivatePage path="/user" component={UserPage} />
            <Route path="/login" component={LoginPage} />
            {/* <Route
              path="/user"
              component={UserPage}
              // render={() => <div>render user</div>}
              // children={() => <div>children user</div>}
            /> */}
            <Route path="/search/:id" component={Search} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
