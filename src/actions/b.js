import { put } from 'redux-saga/effects'

export function bb(state = {}, { payload }) {
  return { ...state, ...payload }
}
export function* bbbb() {
  yield put({ type: 'bb', payload: { value: '22' } })
  return { suc: 'suc' }
}
