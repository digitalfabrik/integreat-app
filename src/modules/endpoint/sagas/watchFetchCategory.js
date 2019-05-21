// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const {city, language, path, depth, key, forceUpdate} = action.params
  try {
    yield call(loadCityContent, dataContainer, city, language, forceUpdate)

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
        error: `Error in fetchCategory: ${e.message}`,
        key: key
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
}
