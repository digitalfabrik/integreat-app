// @flow

import type { Saga } from 'redux-saga'
import { createTunewsElementEndpoint, TunewsModel } from 'api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function * loadTunewsElement (
  id: number
): Saga<Array<TunewsModel>> {
  console.debug('Fetching tunews element')

  const payload = yield call(() => createTunewsElementEndpoint(tunewsApiUrl).request({ id }))
  const tunews: Array<TunewsModel> = [payload.data]

  return tunews
}

export default loadTunewsElement
