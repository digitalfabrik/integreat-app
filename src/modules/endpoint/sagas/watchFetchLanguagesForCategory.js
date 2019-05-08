// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchLanguagesForCategoryActionType,
  FetchLanguagesForCategoryFailedActionType,
  PushLanguagesActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadLanguages from './loadLanguages'

function * fetchLanguages (dataContainer: DataContainer, action: FetchLanguagesForCategoryActionType): Saga<void> {
  const {city, language, depth, key, path} = action.params
  try {
    yield call(loadLanguages, city, dataContainer)

    const languages = yield call(dataContainer.getLanguages)

    const insert: PushLanguagesActionType = {
      type: `PUSH_LANGUAGES`,
      params: {
        languages,
        city,
        language
      }
    }
    yield put(insert)

    if (languages.map(language => language.code).includes(language)) {
      const fetchCategory: FetchCategoryActionType = {
        type: 'FETCH_CATEGORY',
        params: {city, language, depth, key, path, languages}
      }
      yield put(fetchCategory)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchLanguagesForCategoryFailedActionType = {
      type: `FETCH_LANGUAGES_FOR_CATEGORY_FAILED`,
      message: `Error in fetchLanguagesForCategory: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_LANGUAGES_FOR_CATEGORY`, fetchLanguages, dataContainer)
}
