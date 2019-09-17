// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import createLanguagesEndpoint from '@integreat-app/integreat-api-client/endpoints/createLanguagesEndpoint'

export default function * loadLanguages (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<LanguageModel>> {
  const languagesAvailable = yield call(() => dataContainer.languagesAvailable(city))

  if (!(languagesAvailable && !forceRefresh)) {
    console.debug('Fetching languages')

    const payload = yield call(() => createLanguagesEndpoint(baseUrl).request({ city }))
    const languages: Array<LanguageModel> = payload.data

    yield call(dataContainer.setLanguages, city, languages)
    return languages
  }
  console.debug('Using cached languages')
  return yield call(dataContainer.getLanguages, city)
}
