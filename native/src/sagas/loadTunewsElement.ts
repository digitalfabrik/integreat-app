import { createTunewsElementEndpoint, TunewsModel } from 'api-client'
import { call } from 'typed-redux-saga'
import { tunewsApiUrl } from '../constants/endpoint'
import { SagaIterator } from 'redux-saga'

function* loadTunewsElement(id: number): SagaIterator<TunewsModel[]> {
  console.debug('Fetching tunews element')
  const payload = yield* call(() => createTunewsElementEndpoint(tunewsApiUrl).request({ id }))

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return [payload.data]
}

export default loadTunewsElement
