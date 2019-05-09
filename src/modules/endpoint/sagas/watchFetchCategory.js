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
  const {city, language, path, depth, key, forceUpdate, previousLanguage} = action.params
  console.log(action.params)
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
        languages,
        resourceCache,
        path,
        depth,
        key,
        city,
        language,
        previousLanguage
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      message: `Error in fetchCategory: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
}
