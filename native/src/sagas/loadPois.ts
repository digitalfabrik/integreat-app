import { call, SagaGenerator } from 'typed-redux-saga'

import { createPOIsEndpoint, PoiModel } from 'api-client'

import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'

function* loadPois(
  city: string,
  language: string,
  poisEnabled: boolean,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<PoiModel>> {
  const poisAvailable = yield* call(dataContainer.poisAvailable, city, language)

  if (poisAvailable && !forceRefresh) {
    try {
      log('Using cached pois')
      return yield* call(dataContainer.getPois, city, language)
    } catch (e) {
      log('An error occurred while loading pois from JSON', 'error')
      reportError(e)
    }
  }

  if (!poisEnabled) {
    log('Pois disabled')
    yield* call(dataContainer.setPois, city, language, [])
    return []
  }
  log('Fetching pois')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createPOIsEndpoint(apiUrl).request({
      city,
      language,
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
