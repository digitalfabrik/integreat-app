// @flow

import type { Saga } from 'redux-saga'
import { createTuNewsListEndpoint, TuNewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { tuNewsApiUrl } from '../constants'

function * loadTuNews (
  language: string,
  page: number,
  count: number
): Saga<Array<TuNewsModel>> {
  console.debug('Fetching tu news')

  const payload = yield call(() => createTuNewsListEndpoint(tuNewsApiUrl).request({ language, page, count }))
  const newsList: Array<TuNewsModel> = payload.data

  return newsList
}

export default loadTuNews
