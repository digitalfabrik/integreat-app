import { call, SagaGenerator } from 'typed-redux-saga'

import { createTunewsEndpoint, TunewsModel } from 'api-client'

import { tunewsApiUrl } from '../constants/endpoint'
import { log } from '../utils/helpers'

function* loadTunews(city: string, language: string, page: number, count: number): SagaGenerator<Array<TunewsModel>> {
  log('Fetching tunews')
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
