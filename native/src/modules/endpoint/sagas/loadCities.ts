import { CityModel, createCitiesEndpoint, Payload } from 'api-client'
import { StrictEffect, call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

type GeneratorReturnType = Payload<Array<CityModel>> | Array<CityModel> | boolean | string

function* loadCities(dataContainer: DataContainer, forceRefresh: boolean): Generator<StrictEffect, Array<CityModel>, GeneratorReturnType> {
  const citiesAvailable = yield call(() => dataContainer.citiesAvailable())

  if (citiesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached cities')
      return (yield call(dataContainer.getCities)) as Array<CityModel>
    } catch (e) {
      console.warn('An error occurred while loading cities from JSON', e)
    }
  }

  console.debug('Fetching cities')
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload = (yield call(() => createCitiesEndpoint(apiUrl).request())) as Payload<Array<CityModel>>
  const cities = payload.data
  if (!cities) {
    throw new Error("Cities are not available")
  }
  yield call(dataContainer.setCities, cities)
  return cities
}

export default loadCities
