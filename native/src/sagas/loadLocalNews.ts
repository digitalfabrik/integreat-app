import { createLocalNewsEndpoint, LocalNewsModel } from 'api-client'
import { call } from 'typed-redux-saga'
import determineApiUrl from '../services/determineApiUrl'
import { SagaIterator } from 'redux-saga'

function* loadLocalNews(city: string, language: string): SagaIterator<LocalNewsModel[]> {
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
