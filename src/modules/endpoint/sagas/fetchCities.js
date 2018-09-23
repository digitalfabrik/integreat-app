// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { FetchCitiesRequestActionType } from '../../app/StoreActionType'
import citiesEndpoint from '../endpoints/cities'

function * fetch (action: FetchCitiesRequestActionType): Saga<void> {
  try {
    const payload = yield call(citiesEndpoint._loadData.bind(citiesEndpoint), action.params)
    yield put({type: `CITIES_FETCH_SUCCEEDED`, payload: payload})
  } catch (e) {
    yield put({type: `CITIES_FETCH_FAILED`, message: e.message})
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_CITIES_REQUEST`, fetch)
}
