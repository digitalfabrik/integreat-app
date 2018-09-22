// @flow

import type { Saga } from 'redux-saga'
import { call, fork, put, takeLatest } from 'redux-saga/effects'
import type { CategoriesFetchActionType, FetchCategoriesRequestActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import languagesEndpoint from '../endpoints/languages'
import LanguageModel from '../models/LanguageModel'

function * fetchByLanguage (city: string, code: string): Saga<void> {
  try {
    const categoriesPayload = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), {
      city,
      language: code
    })
    const success: CategoriesFetchActionType = {
      type: `CATEGORIES_FETCH_SUCCEEDED`,
      payload: categoriesPayload,
      language: code,
      city: city
    }

    yield put(success)
  } catch (e) {
    const failed: CategoriesFetchActionType = {type: `CATEGORIES_FETCH_FAILED`, message: e.message}
    yield put(failed)
  }
}

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  const city: string = action.params.city
  const prioritised: string = action.params.prioritisedLanguage
  const languagesPayload = yield call(languagesEndpoint._loadData.bind(languagesEndpoint), {city: city})
  const languageModels: Array<LanguageModel> = languagesEndpoint.mapResponse(languagesPayload.data, {city: city})
  const codes = languageModels.map(model => model.code)

  if (codes.includes(prioritised)) {
    yield call(fetchByLanguage, city, prioritised)
  }

  const otherCodes = codes.filter(value => value !== prioritised)
  for (const code: string of otherCodes) {
    const task = fork(fetchByLanguage, city, code)
    yield task
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${categoriesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
