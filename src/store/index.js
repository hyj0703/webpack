// import store from '../utils/reducerAndSaga'
// import actions from '../actions'

// export default store(actions)

import { createStore } from 'redux'

const initLogin = {
  isLogin: false,
  user: { name: '' },
}
function counterReducer(state = { ...initLogin }, action) {
  switch (action.type) {
    case 'loginsuccess':
      return { isLogin: true, user: { name: 'lili' } }
    default:
      return state
  }
}

const store = createStore(counterReducer)
export default store
