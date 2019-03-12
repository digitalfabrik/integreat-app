// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  PushCitiesActionType,
  FetchCitiesFailedActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import { citiesEndpoint, Payload } from '@integreat-app/integreat-api-client'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'
import request from '../request'

function * fetchCities (database: MemoryDatabase): Saga<void> {
  try {
    const payload: Payload<Array<CityModel>> = yield call(() => request(citiesEndpoint))

    const cities: Array<CityModel> = payload.data

    database.loadCities(cities)

    const insert: PushCitiesActionType = {
      type: `PUSH_CITIES`,
      params: {cities: database.cities}
    }
    yield put(insert)
  } catch (e) {
    const failed: FetchCitiesFailedActionType = {
      type: `FETCH_CITIES_FAILED`,
      message: `Error in fetchCities: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_CITIES`, fetchCities, database)
}
