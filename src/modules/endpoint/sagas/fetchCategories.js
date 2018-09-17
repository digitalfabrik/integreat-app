// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type { CategoriesActionType, FetchCategoriesRequestActionType } from '../../app/StoreActionType'
import categoriesEndpoint from '../endpoints/categories'
import languagesEndpoint from '../endpoints/languages'
import LanguageModel from '../models/LanguageModel'

function * fetch (action: FetchCategoriesRequestActionType): Saga<void> {
  const city: string = action.params.city
  const languagesPayload = yield call(languagesEndpoint._loadData.bind(languagesEndpoint), {city: city})
  const languages = languagesEndpoint.mapResponse(languagesPayload.data, {city: city})

  for (const language: LanguageModel of languages) {
    try {
      const code: string = language.code
      const categories = yield call(categoriesEndpoint._loadData.bind(categoriesEndpoint), {city, language: code})
      const success: CategoriesActionType = {
        type: `CATEGORIES_FETCH_SUCCEEDED`,
        payload: categories,
        language: code,
        city: city
      }
      yield put(success)
    } catch (e) {
      const failed: CategoriesActionType = {type: `CATEGORIES_FETCH_FAILED`, message: e.message}
      yield put(failed)
    }
  }
}

export default function * fetchSaga (): Saga<void> {
  yield takeLatest(`FETCH_${categoriesEndpoint.stateName.toUpperCase()}_REQUEST`, fetch)
}
