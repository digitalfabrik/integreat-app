// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  MorphContentLanguageActionType, SwitchContentLanguageActionType, SwitchContentLanguageFailedActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import loadCityContent from './loadCityContent'

function * switchContentLanguage (database: MemoryDatabase, action: SwitchContentLanguageActionType): Saga<void> {
  const {city, newLanguage} = action.params
  try {
    yield call(loadCityContent, database, city, newLanguage)

    const insert: MorphContentLanguageActionType = {
      type: `MORPH_CONTENT_LANGUAGE`,
      params: {
        newCategoriesMap: database.categoriesMap,
        newResourceCache: database.resourceCache,
        newLanguage: newLanguage
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: SwitchContentLanguageFailedActionType = {
      type: `SWITCH_CONTENT_LANGUAGE_FAILED`,
      message: `Error in fetchCategory: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`SWITCH_CONTENT_LANGUAGE`, switchContentLanguage, database)
}
