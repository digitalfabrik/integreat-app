import { Saga } from 'redux-saga'
import { createLocalNewsEndpoint, LanguageModel, LocalNewsModel, Payload } from 'api-client'
import { call, StrictEffect } from 'redux-saga/effects'
import determineApiUrl from '../determineApiUrl'

type GeneratorReturnType = Payload<Array<LocalNewsModel>> | Array<LocalNewsModel> | string

function* loadLocalNews(
  city: string,
  language: string
): Generator<StrictEffect, Array<LocalNewsModel>, GeneratorReturnType> {
  console.debug('Fetching news')
  const apiUrl = (yield call(determineApiUrl)) as string
  const payload = (yield call(() =>
    createLocalNewsEndpoint(apiUrl).request({
      city,
      language
    })
  )) as Payload<Array<LocalNewsModel>>
  const news = payload.data
  if (!news) {
    throw new Error('News are not available.')
  }
  return news
}

export default loadLocalNews
