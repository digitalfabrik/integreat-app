// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import {
  createLanguagesEndpoint,
  LanguageModel,
  createTunewsLanguagesEndpoint
} from '@integreat-app/integreat-api-client'
import type { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'
import { tunewsApiUrl } from '../constants'

export default function * loadLanguages (
  city: string,
  dataContainer: DataContainer,
  forceRefresh: boolean,
  isTunewsContext?: boolean
): Saga<Array<LanguageModel>> {
  if (isTunewsContext) {
    console.debug('Fetching tunews languages')

    const payload = yield call(() =>
      createTunewsLanguagesEndpoint(tunewsApiUrl).request({ city })
    )
    const languages: Array<LanguageModel> = payload.data

    return languages
  }
  const languagesAvailable = yield call(() =>
    dataContainer.languagesAvailable(city)
  )

  if (languagesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached languages')
      return yield call(dataContainer.getLanguages, city)
    } catch (e) {
      console.warn('An error occurred while loading languages from JSON', e)
    }
  }

  console.debug('Fetching languages')

  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() =>
    createLanguagesEndpoint(apiUrl).request({ city })
  )
  const languages: Array<LanguageModel> = payload.data

  yield call(dataContainer.setLanguages, city, languages)
  return languages
}
