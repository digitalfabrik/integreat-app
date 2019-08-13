// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  PushCitiesActionType,
  FetchCitiesFailedActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import { createCitiesEndpoint, Payload } from '@integreat-app/integreat-api-client'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'
import request from '../request'
import { baseUrl } from '../constants'

function * fetchCities (dataContainer: DataContainer): Saga<void> {
  try {
    let cities: Array<CityModel>
    if (yield call(() => dataContainer.citiesAvailable())) {
      cities = yield call(() => dataContainer.getCities())
    } else {
      const payload: Payload<Array<CityModel>> = yield call(() => request(createCitiesEndpoint(baseUrl)))
      cities = payload.data
      yield call(dataContainer.setCities, cities)
    }

    const insert: PushCitiesActionType = {
      type: `PUSH_CITIES`,
      params: { cities: cities }
    }
    yield put(insert)
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
