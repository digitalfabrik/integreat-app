// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest, fork, cancel } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const {city, language, path, depth, key, forceUpdate, shouldRefreshResources} = action.params
  try {
    yield call(loadCityContent, dataContainer, city, language, forceUpdate, shouldRefreshResources)

    const [categoriesMap, resourceCache, languages] = yield all([
      call(dataContainer.getCategoriesMap),
      call(dataContainer.getResourceCache),
      call(dataContainer.getLanguages)
    ])

    const insert: PushCategoryActionType = {
      type: `PUSH_CATEGORY`,
      params: {
        categoriesMap,
        resourceCache,
        path,
        languages,
        depth,
        key,
        city,
        language
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      params: {
        message: `Error in fetchCategory: ${e.message}`
      }
    }
    yield put(failed)
  }
}

function * cancelSaga (saga: Saga): Saga<void> {
  console.log('cancel')
  yield cancel(saga)
}

export default function * (dataContainer: DataContainer): Saga<void> {
  const fetchCategorySaga = yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
  yield fork(takeLatest, `SWITCH_CONTENT_LANGUAGE`, cancelSaga, fetchCategorySaga)
}
