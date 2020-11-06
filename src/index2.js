import React from 'react'
import ReactDom from 'react-dom'
// import { Provider } from 'react-redux'
import { Provider } from './kReactRedux'
import store from './store/index'
// import { Router, Switch, Route } from 'react-router-dom'
// import { createHashHistory } from 'history'

// import Page1 from './components/page1'
// import Page2 from './components/page2'
import ReactRouterPage from './components/ReactRouterPage'
// import MyReactRouterPage from './components/MyReactRouterPage'
ReactDom.render(
  <Provider store={store}>
    <ReactRouterPage />
  </Provider>,
  document.getElementById('root')
)

// ReactDom.render(
//   <Provider store={store}>
//     <Router history={createHashHistory()}>
//       <React.Fragment>
//         <Switch>
//           <Route exact path="/" component={Page1} />
//           <Route path="/page2" component={Page2} />
//         </Switch>
//       </React.Fragment>
//     </Router>
//   </Provider>,
//   document.getElementById('root')
// )
