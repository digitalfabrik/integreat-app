import { CityModel, createCitiesEndpoint, Payload } from 'api-client'
import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function* loadCities(dataContainer: DataContainer, forceRefresh: boolean): SagaIterator<Array<CityModel>> {
  const citiesAvailable: boolean = yield call(() => dataContainer.citiesAvailable())

  if (citiesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached cities')
      return yield call(dataContainer.getCities)
    } catch (e) {
      console.warn('An error occurred while loading cities from JSON', e)
    }
  }

  console.debug('Fetching cities')
  const apiUrl: string = yield call(determineApiUrl)
  const payload: Payload<Array<CityModel>> = yield call(() => createCitiesEndpoint(apiUrl).request())
  const cities = payload.data
  if (!cities) {
    throw new Error('Cities are not available')
  }
  yield call(dataContainer.setCities, cities)
  return cities
}

export default loadCities
