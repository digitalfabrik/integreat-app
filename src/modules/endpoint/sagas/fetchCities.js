// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  CitiesFetchFailedActionType,
  CitiesFetchSucceededActionType,
  FetchCitiesRequestActionType
} from '../../app/StoreActionType'
import citiesEndpoint from '../endpoints/cities'

function * fetch (action: FetchCitiesRequestActionType): Saga<void> {
  try {
    const payload = yield call(citiesEndpoint._loadData.bind(citiesEndpoint), action.params)
    const success: CitiesFetchSucceededActionType = {type: `CITIES_FETCH_SUCCEEDED`, payload: payload}
    yield put(success)
  } catch (e) {
    const failed: CitiesFetchFailedActionType = {type: `CITIES_FETCH_FAILED`, message: e.message}
    yield put(failed)
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_CITIES_REQUEST`, fetch)
}
