// @flow

import type { Saga } from 'redux-saga'
import { createTunewsElementEndpoint, TunewsModel } from 'api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'

function * loadTunewsElement (
  city: string,
  language: string,
  id: number
): Saga<Array<TunewsModel>> {
  console.debug('Fetching tunews element')

  const payload = yield call(createTunewsElementEndpoint(tunewsApiUrl).request, { city, language, id })
  return [payload.data]
}

export default loadTunewsElement
