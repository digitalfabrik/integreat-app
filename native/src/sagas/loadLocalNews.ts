import { call, SagaGenerator } from 'typed-redux-saga'

import { createLocalNewsEndpoint, LocalNewsModel } from 'api-client'

import { determineApiUrl, log } from '../utils/helpers'

function* loadLocalNews(city: string, language: string): SagaGenerator<LocalNewsModel[]> {
  log('Fetching news')
  const apiUrl = yield* call(determineApiUrl)
  const payload = yield* call(() =>
    createLocalNewsEndpoint(apiUrl).request({
      city,
      language
    })
  )
  if (!payload.data) {
    throw new Error('News are not available.')
  }
  return payload.data
}

export default loadLocalNews
