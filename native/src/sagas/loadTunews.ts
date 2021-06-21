import { createTunewsEndpoint, TunewsModel } from 'api-client'
import { call } from 'typed-redux-saga'
import { tunewsApiUrl } from '../constants/endpoint'
import { SagaIterator } from 'redux-saga'

function* loadTunews(city: string, language: string, page: number, count: number): SagaIterator<Array<TunewsModel>> {
  console.debug('Fetching tunews')
  const payload = yield* call(() =>
    createTunewsEndpoint(tunewsApiUrl).request({
      city,
      language,
      page,
      count
    })
  )

  if (!payload.data) {
    throw new Error('Tunews not available')
  }

  return payload.data
}

export default loadTunews
