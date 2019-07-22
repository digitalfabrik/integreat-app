// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest, race, take, select } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'
import isPeekRoute from '../selectors/isPeekRoute'

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

/**
 * This fetch corresponds to a peek if the major content language is not equal to the name of the current route.
 * In this case the fetching behaves different. It doesn't fetch resources for example.
 *
 * @param key The key of the current route
 * @returns true if the fetch corresponds to a peek
 */
function * isPeek (key: string): Saga<boolean> {
  return yield select(state => isPeekRoute(state, { routeKey: key }))
}

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const { city, language, path, depth, key, criterion } = action.params
  try {
    const peek = yield call(isPeek, key)

    const loadCriterion = new ContentLoadCriterion(criterion, peek)
    const cityContentLoaded = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    if (cityContentLoaded) {
      // Only proceed if the content is ready to be pushed to the state. If not then the UI automatically displays an
      // appropriate error

      const context = new DatabaseContext(city, language)
      const [categoriesMap] = yield all([
        call(dataContainer.getCategoriesMap, context)
      ])

      let resourceCache = {}

      const resourceCacheAvailable = yield call({ context: dataContainer, fn: dataContainer.resourceCacheAvailable }, context)

      if (resourceCacheAvailable) {
        // TODO: This call should happen parallel
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
