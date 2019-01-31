// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  InsertCategoryActionType, SelectCategoryActionType, SelectCategoryFailedActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import fetchCategories from './fetchCategories'

function * selectCategory (database: MemoryDatabase, action: SelectCategoryActionType): Saga<void> {
  const {city, language} = action.params

  try {
    if (!database.hasContext() || database.context.cityCode !== city || database.context.languageCode !== language) {
      yield call(fetchCategories, database, city, language)
    }

    const insert: InsertCategoryActionType = {
      type: `INSERT_CATEGORY`,
      params: {categoriesMap: database.categoriesMap, selectAction: action}
    }
    yield put(insert)
  } catch (e) {
    const failed: SelectCategoryFailedActionType = {
      type: `SELECT_CATEGORY_FAILED`,
      message: e.message
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`SELECT_CATEGORY`, selectCategory, database)
}
