// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel } from '@integreat-app/integreat-api-client'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'

export default function * loadLanguages (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<LanguageModel>> {
  const languagesAvailable = yield call(() => dataContainer.languagesAvailable(city))

  if (languagesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached languages')
      return yield call(dataContainer.getLanguages, city)
    } catch (e) {
      console.error('An error occurred while loading languages from JSON', e)
    }
  }

  console.debug('Fetching languages')

  const payload = yield call(() => createLanguagesEndpoint(baseUrl).request({ city }))
  const languages: Array<LanguageModel> = payload.data

  yield call(dataContainer.setLanguages, city, languages)
  return languages
}
