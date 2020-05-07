// @flow

import type { Saga } from 'redux-saga'
import { createLocalNewsEndpoint, LocalNewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import determineApiUrl from '../determineApiUrl'

function * loadLocalNews (
  city: string,
  language: string
  /*
  Note: no need for these to params as it shouldn't be saved to cache
  dataContainer: DataContainer,
  forceRefresh: boolean
  */
): Saga<Array<LocalNewsModel>> {
  console.debug('Fetching news')

  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() => createLocalNewsEndpoint(apiUrl).request({ city, language }))

  const newsList: Array<LocalNewsModel> = payload.data

  return newsList
}

export default loadLocalNews
