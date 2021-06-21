import { CityModel, createCitiesEndpoint } from 'api-client'
import { SagaIterator } from 'redux-saga'
import { call } from 'typed-redux-saga'
import { DataContainer } from '../services/DataContainer'
import determineApiUrl from '../services/determineApiUrl'

function* loadCities(dataContainer: DataContainer, forceRefresh: boolean): SagaIterator<Array<CityModel>> {
  const citiesAvailable = yield* call(dataContainer.citiesAvailable)

  if (citiesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached cities')
      return yield* call(dataContainer.getCities)
    } catch (e) {
      console.warn('An error occurred while loading cities from JSON', e)
    }
  }

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
