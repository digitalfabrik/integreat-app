// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from '@integreat-app/integreat-api-client'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'

export default function * loadLanguages (
  city: string,
  dataContainer: DataContainer, shouldUpdate: boolean
): Saga<void> {
  const languagesAvailable = yield call(() => dataContainer.languagesAvailable(city))

  if (languagesAvailable && !shouldUpdate) {
    console.debug('Using cached languages')
    return
  }
  console.debug('Fetching languages')
  const params = { city }
  const payload: Payload<Array<LanguageModel>> = yield call(() => createLanguagesEndpoint(baseUrl).request(params))
  yield call(dataContainer.setLanguages, city, payload.data)
}
