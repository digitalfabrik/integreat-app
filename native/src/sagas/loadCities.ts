import { call, SagaGenerator } from 'typed-redux-saga'

import { CityModel, createCitiesEndpoint } from 'api-client'

import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'

function* loadCities(dataContainer: DataContainer, forceRefresh: boolean): SagaGenerator<Array<CityModel>> {
  const citiesAvailable = yield* call(dataContainer.citiesAvailable)

  if (citiesAvailable && !forceRefresh) {
    try {
      // eslint-disable-next-line no-console
      console.debug('Using cached cities')
      return yield* call(dataContainer.getCities)
    } catch (e) {
      console.warn('An error occurred while loading cities from JSON', e)
    }
  }
  // eslint-disable-next-line no-console
  console.debug('Fetching cities')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() => createCitiesEndpoint(apiUrl).request())
  const cities = payload.data
  if (!cities) {
    throw new Error('Cities are not available')
  }
  yield* call(dataContainer.setCities, cities)
  return cities
}

export default loadCities
