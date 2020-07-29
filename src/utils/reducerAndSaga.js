import { combineReducers } from 'redux'
import { takeEvery, call } from 'redux-saga/effects'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

let actionObj = {}
export default function getStore(src) {
  const reducersToCombine = {}
  actionObj = getActionObj(src)
  //获取reducer函数
  for (let stateName in actionObj) {
    const { reducers, def } = actionObj[stateName] || {}
    if (reducers) {
      reducersToCombine[stateName] = (state = def, action) => {
        const { type } = action
        const reducer = reducers[type]
        if (reducer) return reducer(state, action)
        return state
      }
    }
  }

  const reducer = combineReducers(reducersToCombine)

  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(reducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(saga)
  return store
}

/**
 * 获取saga函数
 */
function* saga() {
  for (let stateName in actionObj) {
    const { sagas } = actionObj[stateName] || {}
    for (let type in sagas) {
      yield takeEvery(type, function* (action) {
        const { _resolve, _reject } = action
        try {
          const ret = yield call(sagas[type], action)
          if (_resolve) _resolve(ret)
        } catch (e) {
          if (_reject) {
            _reject(e)
          } else {
            throw e
          }
        }
        delete action._resolve
        delete action._reject
      })
    }
  }
}

/**
 * 初始化
 * @param {Object} actions
 */
function getActionObj(actions) {
  const obj = {}
  for (let type in actions) {
    obj[type] = format(actions[type])
  }
  return obj
}
/**
 * 是否是generator函数
 * @param {*} obj
 * @returns {Boolean} 是否是generator函数
 */
function isGeneratorFunction({ constructor }) {
  if (!constructor) return false
  const { name, displayName } = constructor
  if (name === 'GeneratorFunction' || displayName === 'GeneratorFunction')
    return true
  const { prototype } = constructor
  return (
    typeof prototype.next === 'function' &&
    typeof prototype.throw === 'function'
  )
}
/**
 * 格式化
 * @param {Object} actions
 */
function format(actions) {
  const reducers = {}
  const sagas = {}
  let def = {}
  for (let type in actions) {
    const action = actions[type]
    if (type === 'default') {
      def = action
    } else {
      action.type = type
      if (isGeneratorFunction(action)) {
        sagas[type] = action
      } else {
        reducers[type] = action
      }
    }
  }
  return {
    def,
    reducers,
    sagas,
  }
}
/**
 * 能返回promise的dispatch
 * @param {Function} dispatch
 * @param {Object} action
 */
export function promiseDispatch(dispatch, action) {
  return new Promise((resolve, reject) => {
    action._resolve = resolve
    action._reject = reject
    dispatch(action)
  })
}
/**
 * dispatch能返回promise的mapDispatchToProps
 * @param {Function} mapDispatchToProps
 * @returns {Function} dispatch能返回promise的mapDispatchToProps
 */
export function withPromise(mapDispatchToProps) {
  return (dispatch, ownProps) =>
    mapDispatchToProps((action) => promiseDispatch(dispatch, action), ownProps)
}
