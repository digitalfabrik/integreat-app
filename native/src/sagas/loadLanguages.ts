import { call, SagaGenerator } from 'typed-redux-saga'

import { createLanguagesEndpoint, LanguageModel } from 'api-client'

import { DataContainer } from '../utils/DataContainer'
import { determineApiUrl } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'

export default function* loadLanguages(
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaGenerator<Array<LanguageModel>> {
  const languagesAvailable = yield* call(dataContainer.languagesAvailable, city)

  if (languagesAvailable && !forceRefresh) {
    try {
      log('Using cached languages')
      return yield* call(dataContainer.getLanguages, city)
    } catch (e) {
      log('An error occurred while loading languages from JSON', 'error')
      reportError(e)
    }
  }
  log('Fetching languages')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createLanguagesEndpoint(apiUrl).request({
      city,
    })
  )
  const languages = payload.data
  if (!languages) {
    throw new Error('Languages are not available.')
  }
  yield* call(dataContainer.setLanguages, city, languages)
  return languages
}
