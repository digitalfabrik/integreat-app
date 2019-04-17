// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from '@integreat-app/integreat-api-client'
import request from '../request'
import { baseUrl } from '../constants'
import type { DataContainerInterface } from '../DataContainer'

export default function * loadLanguages (city: string, dataContainer: DataContainerInterface): Saga<void> {
  if (dataContainer.languagesAvailable()) {
    return
  }
  const params = {city}
  const payload: Payload<Array<LanguageModel>> = yield call(() => request(createLanguagesEndpoint(baseUrl), params))
  yield call(dataContainer.setLanguages, payload.data)
}
