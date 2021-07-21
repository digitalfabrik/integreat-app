import { createTunewsElementEndpoint, TunewsModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'
import { tunewsApiUrl } from '../constants/endpoint'

function* loadTunewsElement(id: number): SagaGenerator<TunewsModel[]> {
  // eslint-disable-next-line no-console
  console.debug('Fetching tunews element')
  const payload = yield* call(() => createTunewsElementEndpoint(tunewsApiUrl).request({ id }))

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return [payload.data]
}

export default loadTunewsElement
