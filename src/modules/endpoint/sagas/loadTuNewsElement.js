// @flow

import type { Saga } from 'redux-saga'
import { createTunewsElementEndpoint, TunewsModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function * loadTunewsElement (
  id: string
): Saga<Array<TunewsModel>> {
  console.debug('Fetching tunews element')

  const payload = yield call(() => createTunewsElementEndpoint(`${tunewsApiUrl}`).request({ id }))
  const newsItem: Array<TunewsModel> = payload.data

  return [newsItem]
}

export default loadTunewsElement
