import { Saga } from 'redux-saga'
import { CityModel, createCitiesEndpoint } from 'api-client'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function* loadCities(dataContainer: DataContainer, forceRefresh: boolean): Saga<Array<CityModel>> {
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
  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() => createCitiesEndpoint(apiUrl).request())
  const cities: Array<CityModel> = payload.data
  yield call(dataContainer.setCities, cities)
  return cities
}

export default loadCities
