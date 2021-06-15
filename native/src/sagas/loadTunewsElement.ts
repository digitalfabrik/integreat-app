import { createTunewsElementEndpoint, Payload, TunewsModel } from 'api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants/endpoint'
import { SagaIterator } from 'redux-saga'

function* loadTunewsElement(id: number): SagaIterator<TunewsModel[]> {
  console.debug('Fetching tunews element')
  const payload: Payload<TunewsModel> = yield call(() => createTunewsElementEndpoint(tunewsApiUrl).request({ id }))

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return [payload.data]
}

export default loadTunewsElement
