// @flow

import type { Saga } from 'redux-saga'
import { CityModel, createCitiesEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import AppSettings from '../../settings/AppSettings'

function * loadCities (
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<CityModel>> {
  const citiesAvailable = yield call(() => dataContainer.citiesAvailable())

  if (citiesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached cities')
      return yield call(dataContainer.getCities)
    } catch (e) {
      console.warn('An error occurred while loading cities from JSON', e)
    }
  }

  console.debug('Fetching cities')

  const appSettings = new AppSettings()
  const apiUrlOverride = yield call(appSettings.loadApiUrlOverride)

  const payload = yield call(() => createCitiesEndpoint(apiUrlOverride || baseUrl).request())
  const cities: Array<CityModel> = payload.data

  yield call(dataContainer.setCities, cities)
  return cities
}

export default loadCities
