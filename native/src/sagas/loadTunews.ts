import { createTunewsEndpoint, TunewsModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'
import { tunewsApiUrl } from '../constants/endpoint'

function* loadTunews(city: string, language: string, page: number, count: number): SagaGenerator<Array<TunewsModel>> {
  // eslint-disable-next-line no-console
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
