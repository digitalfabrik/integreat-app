import { createLocalNewsEndpoint, LocalNewsModel } from 'api-client'
import { call, SagaGenerator } from 'typed-redux-saga'
import { determineApiUrl } from '../utils/helpers'

function* loadLocalNews(city: string, language: string): SagaGenerator<LocalNewsModel[]> {
  console.debug('Fetching news')
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
