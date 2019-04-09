// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from '@integreat-app/integreat-api-client'
import request from '../request'
import { baseUrl } from '../constants'
import MemoryDatabase from '../MemoryDatabase'

export default function * loadLanguages (city: string, database: MemoryDatabase, shouldUpdate: boolean): Saga<void> {
  yield call(database.readLanguages)

  if (database.languagesLoaded() && !shouldUpdate) {
    return
  }
  const params = {city}
  const payload: Payload<Array<LanguageModel>> = yield call(() => request(createLanguagesEndpoint(baseUrl), params))
  database.languages = payload.data
  yield call(database.writeLanguages)
}
