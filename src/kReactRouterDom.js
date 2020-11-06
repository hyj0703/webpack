import React, { PureComponent, useContext } from 'react'

const RouterContext = React.createContext()
import { createBrowserHistory } from 'history'
export class BrowserRouter extends PureComponent {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory(props)
    this.state = {
      location: this.history.location,
    }
    this.unlisten = this.history.listen((location) => {
      this.setState({
        location,
      })
    })
  }
  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
    }
  }
  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.history,
          location: this.state.location,
        }}>
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}
export function Route(props) {
  const { component: Component, path } = props
  const { location } = useContext(RouterContext)
  const match = path === location.pathname
  return match ? <Component /> : null
}
export class Link extends PureComponent {
  bindleClick = (event, history) => {
    const { to } = this.props
    event.preventDefault()
    history.push(to)
  }
  render() {
    const { to, children } = this.props
    return (
      <RouterContext.Consumer>
        {(ctx) => (
          <a
            href={to}
            onClick={(event) => this.bindleClick(event, ctx.history)}>
            {children}
          </a>
        )}
      </RouterContext.Consumer>
    )
  }
}
