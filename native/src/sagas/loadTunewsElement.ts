import { createTunewsElementEndpoint, Payload, TunewsModel } from 'api-client'
import { call } from 'redux-saga/effects'
import { tunewsApiUrl } from '../constants'
import { SagaIterator } from 'redux-saga'

function* loadTunewsElement(city: string, language: string, id: number): SagaIterator<TunewsModel[]> {
  console.debug('Fetching tunews element')
  const payload: Payload<TunewsModel> = yield call(() =>
    createTunewsElementEndpoint(tunewsApiUrl).request({
      city,
      language,
      id
    })
  )

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return [payload.data]
}

export default loadTunewsElement
