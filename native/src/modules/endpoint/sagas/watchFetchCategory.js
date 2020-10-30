// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType, RefreshCategoryActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import ErrorCodes, { fromError } from '../../error/ErrorCodes'
import type Moment from 'moment'

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
    const languageValid = yield call(loadCityContent, dataContainer, city, language, loadCriterion)

    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages() ? yield call(dataContainer.getLanguages, city) : []

    if (languageValid) {
      const [categoriesMap, resourceCache] = yield all([
        call(dataContainer.getCategoriesMap, city, language),
        call(dataContainer.getResourceCache, city, language)
      ])

      const lastUpdate: Moment | null = yield call(dataContainer.getLastUpdate, city, language)

      // $FlowFixMe Flow can't evaluate the type as it is dynamic
      const push: PushCategoryActionType | RefreshCategoryActionType = {
        type: loadCriterion.shouldUpdate(lastUpdate) ? 'REFRESH_CATEGORY' : 'PUSH_CATEGORY',
        params: { categoriesMap, resourceCache, path, cityLanguages, depth, key, city, language }
      }
      yield put(push)
    } else {
      const allAvailableLanguages = path === `/${city}/${language}`
        ? new Map(cityLanguages.map(lng => [lng.code, `/${city}/${lng.code}`]))
        : null
      const failedAction: FetchCategoryFailedActionType = {
        type: 'FETCH_CATEGORY_FAILED',
        params: {
          message: 'Language not available.',
          code: ErrorCodes.PageNotFound,
          key,
          path,
          depth,
          language,
          city,
          allAvailableLanguages
        }
      }
      yield put(failedAction)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: 'FETCH_CATEGORY_FAILED',
      params: {
        message: `Error in fetchCategory: ${e.message}`,
        code: fromError(e),
        key,
        path,
        depth,
        language,
        city,
        allAvailableLanguages: null
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeEvery('FETCH_CATEGORY', fetchCategory, dataContainer)
}
