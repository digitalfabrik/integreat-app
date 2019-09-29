// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, race, select, take, takeLatest } from 'redux-saga/effects'
import type {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType,
  PushCategoryLanguagesActionType
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

function * fetchCategory (dataContainer: DataContainer, action: FetchCategoryActionType): Saga<void> {
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

      const push: PushCategoryActionType = {
        type: `PUSH_CATEGORY`,
        params: { categoriesMap, resourceCache, path, cityLanguages, depth, key, city, language }
      }

      yield put(push)
    } else if (path === `/${city}/${language}`) {
      const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, `/${city}/${lng.code}`]))
      const pushLanguages: PushCategoryLanguagesActionType = {
        type: `PUSH_CATEGORY_LANGUAGES`,
        params: { city, language, depth, allAvailableLanguages, key }
      }
      yield put(pushLanguages)
    } else {
      const failed: FetchCategoryFailedActionType = {
        type: `FETCH_CATEGORY_FAILED`,
        params: {
          message: 'Could not load category.', key, path, depth, language, city
        }
      }
      yield put(failed)
    }
  } catch (e) {
    console.error(e)
    const failed: FetchCategoryFailedActionType = {
      type: `FETCH_CATEGORY_FAILED`,
      params: {
        message: `Error in fetchCategory: ${e.message}`, key, path, depth, language, city
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
