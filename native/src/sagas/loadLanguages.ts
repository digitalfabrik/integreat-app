import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from 'api-client'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

export default function* loadLanguages(
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): SagaIterator<Array<LanguageModel>> {
  const languagesAvailable: boolean = yield call(() => dataContainer.languagesAvailable(city))

  if (languagesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached languages')
      return yield call(dataContainer.getLanguages, city)
    } catch (e) {
      console.warn('An error occurred while loading languages from JSON', e)
    }
  }

  console.debug('Fetching languages')
  const apiUrl: string = yield call(determineApiUrl)
  const payload: Payload<Array<LanguageModel>> = yield call(() =>
    createLanguagesEndpoint(apiUrl).request({
      city
    })
  )
  const languages = payload.data
  if (!languages) {
    throw new Error('Languages are not available.')
  }
  yield call(dataContainer.setLanguages, city, languages)
  return languages
}
