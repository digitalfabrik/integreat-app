// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest, race, take } from 'redux-saga/effects'
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

function * cancelableFetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const { cancel } = yield race({
    response: call(fetchCategory, dataContainer, action),
    cancel: take('SWITCH_CONTENT_LANGUAGE')
  })

  if (cancel) {
    const newLanguage = cancel.params.newLanguage
    const newFetchCategory: FetchCategoryActionType = {
      type: 'FETCH_CATEGORY',
      params: {
        language: newLanguage,
        path: `/${action.params.city}/${newLanguage}`,
        ...action.params
      }
    }
    yield put(newFetchCategory)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, cancelableFetchCategory, dataContainer)
}
