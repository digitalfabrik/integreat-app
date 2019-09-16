// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'

/**
 * This fetch corresponds to a peek if the major content city is not equal to the city of the current route.
 * In this case the fetching behaves different. It doesn't fetch resources for example.
 *
 * @see {isPeekingRoute}
 * @param routeCity The key of the current route
 * @returns true if the fetch corresponds to a peek
 */
function * isPeeking (routeCity: string): Saga<boolean> {
  return yield select(state => isPeekingRoute(state, { routeCity }))
}

export function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
  const { city, language, path, depth, key, criterion } = action.params
  try {
    const peeking = yield call(isPeeking, city)

    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const cityContentLoaded = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    if (cityContentLoaded) {
      // Only proceed if the content is ready to be pushed to the state. If not then the UI automatically displays an
      // appropriate error
      const [categoriesMap, resourceCache] = yield all([
        call(dataContainer.getCategoriesMap, city, language),
        call(dataContainer.getResourceCache, city, language)
      ])

      // Only get languages if we've loaded them, otherwise we're peeking
      const cityLanguages = loadCriterion.shouldLoadLanguages() ? yield call(dataContainer.getLanguages, city) : []

      const push: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: { categoriesMap, resourceCache, path, cityLanguages, depth, key, city, language }
      }

      yield put(push)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      params: {
        message: `Error in fetchCategory: ${e.message}`, key
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`FETCH_CATEGORY`, fetchCategory, dataContainer)
}
