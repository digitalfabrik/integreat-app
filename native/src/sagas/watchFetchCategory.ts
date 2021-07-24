import { call, put, SagaGenerator, select, takeEvery } from 'typed-redux-saga'
import {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../redux/StoreActionType'
import { DataContainer } from '../utils/DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../models/ContentLoadCriterion'
import isPeekingRoute from '../redux/selectors/isPeekingRoute'
import { ErrorCode, fromError } from 'api-client'

/**
 * This fetch corresponds to a peek if the major content city is not equal to the city of the current route.
 * In this case the fetching behaves different. It doesn't fetch resources for example.
 *
 * @see {isPeekingRoute}
 * @param routeCity The key of the current route
 * @returns true if the fetch corresponds to a peek
 */
function* isPeeking(routeCity: string): SagaGenerator<boolean> {
  return yield* select(state =>
    isPeekingRoute(state, {
      routeCity
    })
  )
}

export function* fetchCategory(dataContainer: DataContainer, action: FetchCategoryActionType): SagaGenerator<void> {
  const { city, language, path, depth, key, criterion } = action.params

  try {
    const peeking = yield* call(isPeeking, city)
    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield* call(loadCityContent, dataContainer, city, language, loadCriterion)
    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages = loadCriterion.shouldLoadLanguages() ? yield* call(dataContainer.getLanguages, city) : []

    if (languageValid) {
      const categoriesMap = yield* call(dataContainer.getCategoriesMap, city, language)
      const resourceCache = yield* call(dataContainer.getResourceCache, city, language)
      const lastUpdate = yield* call(dataContainer.getLastUpdate, city, language)
      const refresh = loadCriterion.shouldUpdate(lastUpdate)
      const push: PushCategoryActionType = {
        type: 'PUSH_CATEGORY',
        params: {
          categoriesMap,
          resourceCache,
          path,
          cityLanguages,
          depth,
          key,
          city,
          language,
          refresh
        }
      }
      yield* put(push)
    } else {
      const allAvailableLanguages =
        path === `/${city}/${language}` ? new Map(cityLanguages.map(lng => [lng.code, `/${city}/${lng.code}`])) : null
      const failedAction: FetchCategoryFailedActionType = {
        type: 'FETCH_CATEGORY_FAILED',
        params: {
          message: 'Language not available.',
          code: ErrorCode.PageNotFound,
          key,
          path,
          depth,
          language,
          city,
          allAvailableLanguages
        }
      }
      yield* put(failedAction)
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
    yield* put(failed)
  }
}

export default function* (dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeEvery('FETCH_CATEGORY', fetchCategory, dataContainer)
}
