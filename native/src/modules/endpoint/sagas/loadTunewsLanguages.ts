import { call } from 'redux-saga/effects'
import { createTunewsLanguagesEndpoint, LanguageModel, Payload } from 'api-client'
import { tunewsApiUrl } from '../constants'
import { SagaIterator } from 'redux-saga'

export default function* loadTunewsLanguages(city: string): SagaIterator<LanguageModel[]> {
  console.debug('Fetching tunews languages')
  const payload: Payload<LanguageModel[]> = yield call(() =>
    createTunewsLanguagesEndpoint(tunewsApiUrl).request({
      city
    })
  )

  if (!payload.data) {
    throw new Error('Tunews languages are not available.')
  }
  return payload.data
}
