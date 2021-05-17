import { call, CallEffect } from 'redux-saga/effects'
import { createTunewsLanguagesEndpoint, LanguageModel, Payload } from 'api-client'
import { tunewsApiUrl } from '../constants'

export default function* loadTunewsLanguages(
  city: string
): Generator<CallEffect, Array<LanguageModel> | null | undefined, Payload<LanguageModel[]>> {
  console.debug('Fetching tunews languages')
  const payload = (yield call(() =>
    createTunewsLanguagesEndpoint(tunewsApiUrl).request({
      city
    })
  )) as Payload<LanguageModel[]>
  const languages: Array<LanguageModel> | null | undefined = payload.data
  return languages
}
