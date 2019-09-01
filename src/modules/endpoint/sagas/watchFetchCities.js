// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { FetchCitiesActionType, FetchCitiesFailedActionType } from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCities from './loadCities'

function * fetchCities (dataContainer: DataContainer, action: FetchCitiesActionType): Saga<void> {
  try {
    yield call(loadCities, dataContainer, action.params.forceRefresh)
  } catch (e) {
    console.error(e)
    const failed: FetchCitiesFailedActionType = {
      type: `FETCH_CITIES_FAILED`,
      params: {
        message: `Error in fetchCities: ${e.message}`
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CITIES`, fetchCities, dataContainer)
}
