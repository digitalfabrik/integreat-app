import { createLocalNewsEndpoint, LocalNewsModel, Payload } from 'api-client'
import { call } from 'redux-saga/effects'
import determineApiUrl from '../determineApiUrl'
import { SagaIterator } from 'redux-saga'

function* loadLocalNews(city: string, language: string): SagaIterator<LocalNewsModel[]> {
  console.debug('Fetching news')
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload: Payload<LocalNewsModel[]> = yield call(() =>
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
