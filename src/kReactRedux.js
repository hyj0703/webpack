import React, { useContext, useState, useEffect } from 'react'

const ReduxContext = React.createContext()
export function Provider({ store, children }) {
  return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
}

export const connect = (
  mapStateToProps = (state) => state,
  mapDispatchToProps = {}
) => (Cmp) => (props) => {
  const store = useContext(ReduxContext)
  const getMoreProps = () => {
    const stateProps = mapStateToProps(store.getState())
    const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
    return { ...stateProps, ...dispatchProps }
  }
  useEffect(() => {
    store.subscribe(() => {
      setMoreProps({
        ...moreProps,
        ...getMoreProps(),
      })
    })
  }, [])
  const [moreProps, setMoreProps] = useState(getMoreProps())
  return <Cmp {...props} {...moreProps} />
}
function bindActionCreator(actionCreator, dispatch) {
  return (...props) => dispatch(actionCreator(...props))
}
function bindActionCreators(actionCreators, dispatch) {
  const obj = {}
  for (let key in actionCreators) {
    obj[key] = bindActionCreator(actionCreators[key], dispatch)
  }
  return obj
}
