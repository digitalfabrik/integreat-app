// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  CitiesFetchFailedActionType,
  CitiesFetchSucceededActionType,
  FetchCitiesRequestActionType, SelectCitiesActionType
} from '../../app/StoreActionType'
import { Payload, citiesEndpoint } from '@integreat-app/integreat-api-client'
import request from '../request'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'
import MemoryDatabase from '../MemoryDatabase'

function * fetch (database: MemoryDatabase, action: FetchCitiesRequestActionType): Saga<void> {
  try {
    const payload: Payload<Array<CityModel>> = yield call(() => request(citiesEndpoint, action.params))

    const cities: Array<CityModel> = payload.data

    database.loadCities(cities)

    // const success: CitiesFetchSucceededActionType = {type: `CITIES_FETCH_SUCCEEDED`, payload: {}}
    // yield put(success)

    const selection: SelectCitiesActionType = {
      type: `SELECT_CITIES`,
      params: {cities}
    }
    yield put(selection)
  } catch (e) {
    const failed: CitiesFetchFailedActionType = {type: `CITIES_FETCH_FAILED`, message: e.message}
    yield put(failed)
  }
}

export default function * fetchCities (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_CITIES_REQUEST`, fetch, database)
}
