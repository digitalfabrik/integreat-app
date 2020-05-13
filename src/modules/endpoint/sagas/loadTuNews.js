// @flow

import type { Saga } from 'redux-saga'
import { createTunewsEndpoint, TunewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function * loadTunews (
  language: string,
  page: number,
  count: number
): Saga<Array<TunewsModel>> {
  console.debug('Fetching tunews')

  const payload = yield call(() => createTunewsEndpoint(tunewsApiUrl).request({ language, page, count }))
  const newsList: Array<TunewsModel> = payload.data

  return newsList
}

export default loadTunews
