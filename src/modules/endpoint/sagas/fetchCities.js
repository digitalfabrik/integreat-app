// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { CitiesActionType } from '../../app/StoreActionType'
import citiesEndpoint from '../endpoints/cities'

function * fetch (action: CitiesActionType): Saga<void> {
  try {
    const payload = yield call(citiesEndpoint._loadData.bind(citiesEndpoint), action.params)
    yield put({type: `${citiesEndpoint.stateName.toUpperCase()}_FETCH_SUCCEEDED`, payload: payload})
  } catch (e) {
    yield put({type: `${citiesEndpoint.stateName.toUpperCase()}_FETCH_FAILED`, message: e.message})
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${citiesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
