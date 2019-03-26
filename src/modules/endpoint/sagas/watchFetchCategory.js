// @flow

import type { Saga } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType, SwitchCityContentLanguageActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import loadCityContent from './loadCityContent'
import type { StateType } from '../../app/StateType'

function * fetchCategory (database: MemoryDatabase, action: FetchCategoryActionType): Saga<void> {
  const {city, language, path, depth, key} = action.params
  try {
    yield call(loadCityContent, database, city, language)

    const currentLanguage = yield select((state: StateType) => state.cityContent.language)

    if (path === undefined || depth === undefined) {
      // you did not provide a new key and depth it is most likely a language change

      if (currentLanguage === language) {
        // If you request the same language as we already have just return
        return
      }

      const insert: SwitchCityContentLanguageActionType = {
        type: `SWITCH_CITY_CONTENT_LANGUAGE`,
        params: {
          newCategoriesMap: database.categoriesMap,
          newLanguage: language
        }
      }
      yield put(insert)

      return
    }

    const insert: PushCategoryActionType = {
      type: `PUSH_CATEGORY`,
      params: {
        categoriesMap: database.categoriesMap,
        languages: database.languages,
        resourceCache: database.resourceCacheState,
        path,
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
      message: `Error in fetchCategory: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, database)
}
