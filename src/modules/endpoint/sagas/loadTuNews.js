// @flow

import type { Saga } from 'redux-saga'
import { createTuNewsEndpoint, TuNewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { tuNewsApiUrl } from '../constants'

function * loadTuNews (
  language: string,
  page: number,
  count: number
): Saga<Array<TuNewsModel>> {
  console.debug('Fetching tunews')

  const payload = yield call(() => createTuNewsEndpoint(tuNewsApiUrl).request({ language, page, count }))
  const newsList: Array<TuNewsModel> = payload.data

  return newsList
}

export default loadTuNews
