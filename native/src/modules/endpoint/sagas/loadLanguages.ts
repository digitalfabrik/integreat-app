import { Saga } from 'redux-saga'
import { call, StrictEffect } from 'redux-saga/effects'
import { createLanguagesEndpoint, EventModel, LanguageModel, Payload } from 'api-client'
import { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

type GeneratorReturnType = Payload<Array<LanguageModel>> | Array<LanguageModel> | boolean | string

export default function* loadLanguages(city: string, dataContainer: DataContainer, forceRefresh: boolean):
  Generator<StrictEffect, Array<LanguageModel>, GeneratorReturnType> {
  const languagesAvailable = (yield call(() => dataContainer.languagesAvailable(city))) as boolean

  if (languagesAvailable && !forceRefresh) {
    try {
      console.debug('Using cached languages')
      return (yield call(dataContainer.getLanguages, city)) as Array<LanguageModel>
    } catch (e) {
      console.warn('An error occurred while loading languages from JSON', e)
    }
  }

  console.debug('Fetching languages')
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload = (yield call(() =>
    createLanguagesEndpoint(apiUrl).request({
      city
    })
  )) as Payload<Array<LanguageModel>>
  const languages = payload.data
  if (!languages) {
     throw new Error("Languages are not available.")
  }
  yield call(dataContainer.setLanguages, city, languages)
  return languages
}
