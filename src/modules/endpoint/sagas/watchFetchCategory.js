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
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'
import { LanguageModel } from '@integreat-app/integreat-api-client'

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const { city, language, path, depth, key, criterion } = action.params
  try {
    const loadCriterion = new ContentLoadCriterion(criterion)
    const cityContentLoaded = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    if (cityContentLoaded) {
      // Only proceed if the content is ready to be pushed to the state. If not then the UI automatically displays an
      // appropriate error

      const context = new DatabaseContext(city, language)
      const [categoriesMap, resourceCache] = yield all([
        call(dataContainer.getCategoriesMap, context),
        call(dataContainer.getResourceCache, context)
      ])

      let languages = [new LanguageModel(language, language)]

      if (loadCriterion.shouldLoadLanguages()) {
        languages = yield call(dataContainer.getLanguages, context)
      }

      const push: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: {
          categoriesMap,
          resourceCache,
          path,
          languages,
          depth,
          key,
          city,
          language,
          peek: loadCriterion.peek()
        }
      }
      yield put(push)
    }
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

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
}
