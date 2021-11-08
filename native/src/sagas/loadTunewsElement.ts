import { call, SagaGenerator } from 'typed-redux-saga'

import { createTunewsElementEndpoint, TunewsModel } from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'
import { log } from '../utils/sentry'

function* loadTunewsElement(id: number): SagaGenerator<TunewsModel[]> {
  log('Fetching tunews element')
  const payload = yield* call(() => createTunewsElementEndpoint(tunewsApiUrl).request({ id }))

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return [payload.data]
}

export default loadTunewsElement
