// @flow

import type { Saga } from 'redux-saga'
import { createLocalNewsEndpoint, LocalNewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import determineApiUrl from '../determineApiUrl'

function * loadLocalNews (
  city: string,
  language: string
): Saga<Array<LocalNewsModel>> {
  console.debug('Fetching news')

  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() => createLocalNewsEndpoint(apiUrl).request({ city, language }))

  const newsList: Array<LocalNewsModel> = payload.data

  return newsList
}

export default loadLocalNews
