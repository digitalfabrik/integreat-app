// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { CategoriesActionType, FetchCategoriesRequestActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  try {
    const payload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), action.params)
    const success: CategoriesActionType = {type: `CATEGORIES_FETCH_SUCCEEDED`, payload: payload}
    yield put(success)
  } catch (e) {
    const failed: CategoriesActionType = {type: `CATEGORIES_FETCH_FAILED`, message: e.message}
    yield put(failed)
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${categoriesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
