// @flow

import type { Saga } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { createLanguagesEndpoint, LanguageModel } from '@integreat-app/integreat-api-client'
import request from '../request'
import { baseUrl } from '../constants'
import MemoryDatabase from '../MemoryDatabase'

export default function * loadLanguages (database: MemoryDatabase, city: string): Saga<Array<LanguageModel>> {
  const params = {city}
  database.languages = yield call(() => request(createLanguagesEndpoint(baseUrl), params))

  return database.languages
}
