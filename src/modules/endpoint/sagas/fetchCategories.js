// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { CategoriesActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'

function * fetch (action: CategoriesActionType): Saga<void> {
  try {
    const payload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), action.params)
    yield put({type: `${categoriesEndpoint.stateName.toUpperCase()}_FETCH_SUCCEEDED`, payload: payload})
  } catch (e) {
    yield put({type: `${categoriesEndpoint.stateName.toUpperCase()}_FETCH_FAILED`, message: e.message})
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${categoriesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
