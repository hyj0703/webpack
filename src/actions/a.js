import { put } from 'redux-saga/effects'

export function aaa(state, { payload }) {
  return { ...state, ...payload }
}
export function* aaaa({ payload: { setValue } }) {
  yield put({ type: 'aaa', payload: { value: '3232' } })
  return { suc: '111' }
}
