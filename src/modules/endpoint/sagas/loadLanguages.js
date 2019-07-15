// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from '@integreat-app/integreat-api-client'
import request from '../request'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'
import DatabaseContext from '../DatabaseContext'

export default function * loadLanguages (context: DatabaseContext, dataContainer: DataContainer, shouldUpdate: boolean): Saga<void> {
  const languagesAvailable = yield call(dataContainer.languagesAvailable, context)

  if (languagesAvailable && !shouldUpdate) {
    console.debug('Using cached languages')
    return
  }
  console.debug('Fetching languages')
  const params = {city: context.cityCode}
  const payload: Payload<Array<LanguageModel>> = yield call(() => request(createLanguagesEndpoint(baseUrl), params))
  yield call(dataContainer.setLanguages, context, payload.data)
}
