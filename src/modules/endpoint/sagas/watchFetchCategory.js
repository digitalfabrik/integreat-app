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

function * getRootAvailableLanguages (
  context: DatabaseContext,
  loadCriterion: ContentLoadCriterion, dataContainer: DataContainer): Saga<Map<string, string>> {

  if (loadCriterion.shouldLoadLanguages()) {
    const languages = yield call(dataContainer.getLanguages, context)
    return new Map<string, string>(languages
      .map(language => [language.code, `/${context.cityCode}/${language.code}`]))
  }

  // If there are no loaded languages the result is an empty map because we do not have a root category
  return new Map<string, string>()
}

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const { city, language, path, depth, key, criterion } = action.params
  try {
    const loadCriterion = new ContentLoadCriterion(criterion)
    const cityContentLoaded = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    if (cityContentLoaded) {
      // Only proceed if the content is ready to be pushed to the state. If not then the UI automatically displays an
      // appropriate error

      const context = new DatabaseContext(city, language)
      const [categoriesMap] = yield all([
        call(dataContainer.getCategoriesMap, context)
      ])

      let resourceCache = {}

      const resourceCacheAvailable = yield call({context: dataContainer, fn: dataContainer.resourceCacheAvailable}, context)

      if (resourceCacheAvailable) {
        // TODO: This call should happen paralel
        resourceCache = yield call(dataContainer.getResourceCache, context)
      }

      const rootAvailableLanguages = yield call(getRootAvailableLanguages, context, loadCriterion, dataContainer)

      const push: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: {
          categoriesMap,
          resourceCache,
          path,
          rootAvailableLanguages,
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
