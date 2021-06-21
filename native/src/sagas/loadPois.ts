import { SagaIterator } from 'redux-saga'
import { createPOIsEndpoint, PoiModel } from 'api-client'
import { call } from 'typed-redux-saga'
import { DataContainer } from '../services/DataContainer'
import determineApiUrl from '../services/determineApiUrl'

function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaIterator<Array<PoiModel>> {
  const poisAvailable = yield* call(dataContainer.poisAvailable, city, language)

  if (poisAvailable && !forceRefresh) {
    try {
      console.debug('Using cached pois')
      return yield* call(dataContainer.getPois, city, language)
    } catch (e) {
      console.warn('An error occurred while loading pois from JSON', e)
    }
  }

  if (!poisEnabled) {
    console.debug('Pois disabled')
    yield* call(dataContainer.setPois, city, language, [])
    return []
  }

  console.debug('Fetching pois')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createPOIsEndpoint(apiUrl).request({
      city,
      language
    })
  )
  const pois = payload.data
  if (!pois) {
    throw new Error('Pois are not available!')
  }
  yield* call(dataContainer.setPois, city, language, pois)
  return pois
}

export default loadPois
