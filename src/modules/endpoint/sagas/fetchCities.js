// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { Payload, citiesEndpoint } from '@integreat-app/integreat-api-client'
import request from '../request'
import CityModel from '@integreat-app/integreat-api-client/models/CityModel'
import MemoryDatabase from '../MemoryDatabase'

function * fetchCities (database: MemoryDatabase): Saga<void> {
  const payload: Payload<Array<CityModel>> = yield call(() => request(citiesEndpoint))

  const cities: Array<CityModel> = payload.data

  database.loadCities(cities)
}

export default fetchCities
