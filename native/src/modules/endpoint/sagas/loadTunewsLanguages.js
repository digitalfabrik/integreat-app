// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { LanguageModel, createTunewsLanguagesEndpoint } from 'api-client'
import { tunewsApiUrl } from '../constants'

export default function * loadTunewsLanguages (
  city: string
): Saga<Array<LanguageModel>> {
  console.debug('Fetching tunews languages')
  const payload = yield call(() =>
    createTunewsLanguagesEndpoint(tunewsApiUrl).request({ city })
  )
  const languages: Array<LanguageModel> = payload.data

  return languages
}
