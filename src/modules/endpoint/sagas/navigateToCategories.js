// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  CategoriesFetchFailedActionType,
  CategoriesFetchSucceededActionType,
  FetchCategoriesRequestActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'

function * navigateToCategory (database: MemoryDatabase, action: FetchCategoriesRequestActionType): Saga<void> {

  // fetch
  // select from store
}

export default function * fetchCategories (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`NAVIGATE_TO_CATEGORY`, navigateToCategory, database)
}
