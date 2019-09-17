// @flow

import type { Saga } from 'redux-saga'
import { CityModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import createCitiesEndpoint from '@integreat-app/integreat-api-client/endpoints/createCitiesEndpoint'

function * loadCities (
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<CityModel>> {
  const citiesAvailable = yield call(() => dataContainer.citiesAvailable())

  if (!citiesAvailable || forceRefresh) {
    console.debug('Fetching cities')

    const payload = yield call(() => createCitiesEndpoint(baseUrl).request())
    const cities: Array<CityModel> = payload.data

    yield call(dataContainer.setCities, cities)
    return cities
  }

  console.debug('Using cached cities')
  return yield call(dataContainer.getCities)
}

export default loadCities
