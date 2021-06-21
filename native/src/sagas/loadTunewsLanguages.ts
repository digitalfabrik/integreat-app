import { call } from 'typed-redux-saga'
import { createTunewsLanguagesEndpoint, LanguageModel } from 'api-client'
import { tunewsApiUrl } from '../constants/endpoint'
import { SagaIterator } from 'redux-saga'

export default function* loadTunewsLanguages(): SagaIterator<LanguageModel[]> {
  console.debug('Fetching tunews languages')
  const payload = yield* call(() => createTunewsLanguagesEndpoint(tunewsApiUrl).request(undefined))

  if (!payload.data) {
    throw new Error('Tunews languages are not available.')
  }
  return payload.data
}
