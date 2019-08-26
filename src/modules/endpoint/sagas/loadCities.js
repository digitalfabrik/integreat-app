// @flow

import type { Saga } from 'redux-saga'
import { createCitiesEndpoint, Payload } from '@integreat-app/integreat-api-client'
import { call, put } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'
import type { PushCitiesActionType } from '../../app/StoreActionType'

function * loadCities (
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<CityModel>> {
  let cities: Array<CityModel>
  if (!forceRefresh && (yield call(() => dataContainer.citiesAvailable()))) {
    cities = yield call(() => dataContainer.getCities())
  } else {
    const payload: Payload<Array<CityModel>> = yield call(() => createCitiesEndpoint(baseUrl).request())
    cities = payload.data
    yield call(dataContainer.setCities, cities)
  }

  const insert: PushCitiesActionType = {
    type: `PUSH_CITIES`,
    params: { cities: cities }
  }
  yield put(insert)
  return cities
}

export default loadCities
