// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel, Payload } from '@integreat-app/integreat-api-client'
import request from '../request'
import { baseUrl } from '../constants'
import MemoryDatabase from '../MemoryDatabase'

export default function * loadLanguages (city: string, database: MemoryDatabase): Saga<void> {
  yield call(database.readLanguages)

  if (database.languages) {
    return
  }
  const params = {city}
  const payload: Payload<Array<LanguageModel>> = yield call(() => request(createLanguagesEndpoint(baseUrl), params))
  const languages = payload.data

  database.languages = languages
  yield call(database.writeLanguages)
}
