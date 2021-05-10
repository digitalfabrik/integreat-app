import { Saga } from 'redux-saga'
import { PoiModel, createPOIsEndpoint } from 'api-client'
import { call } from 'redux-saga/effects'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<PoiModel>> {
  const poisAvailable = yield call(() => dataContainer.poisAvailable(city, language))

  if (poisAvailable && !forceRefresh) {
    try {
      console.debug('Using cached pois')
      return yield call(dataContainer.getPois, city, language)
    } catch (e) {
      console.warn('An error occurred while loading pois from JSON', e)
    }
  }

  if (!poisEnabled) {
    console.debug('Pois disabled')
    yield call(dataContainer.setPois, city, language, [])
    return []
  }

  console.debug('Fetching pois')
  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() =>
    createPOIsEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const pois: Array<PoiModel> = payload.data
  yield call(dataContainer.setPois, city, language, pois)
  return pois
}

export default loadPois
