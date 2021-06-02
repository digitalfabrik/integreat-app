import { call, CallEffect, ForkEffect, put, PutEffect, select, SelectEffect, takeEvery } from 'redux-saga/effects'
import {
  FetchCategoryActionType,
  FetchCategoryFailedActionType,
  PushCategoryActionType
} from '../../app/StoreActionType'
import { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import isPeekingRoute from '../selectors/isPeekingRoute'
import { ErrorCode, fromError } from '../../error/ErrorCodes'
import { Moment } from 'moment'
import { CategoriesMapModel, LanguageModel } from 'api-client'
import { LanguageResourceCacheStateType } from '../../app/StateType'

/**
 * This fetch corresponds to a peek if the major content city is not equal to the city of the current route.
 * In this case the fetching behaves different. It doesn't fetch resources for example.
 *
 * @see {isPeekingRoute}
 * @param routeCity The key of the current route
 * @returns true if the fetch corresponds to a peek
 */
function* isPeeking(routeCity: string): Generator<SelectEffect, void> {
  yield select(state =>
    isPeekingRoute(state, {
      routeCity
    })
  )
}

export function* fetchCategory(
  dataContainer: DataContainer,
  action: FetchCategoryActionType
): Generator<
  CallEffect | PutEffect,
  void,
  CategoriesMapModel | LanguageResourceCacheStateType | Moment | null | Array<LanguageModel> | boolean
> {
  const { city, language, path, depth, key, criterion } = action.params

  try {
    const peeking = (yield call(isPeeking, city)) as boolean
    const loadCriterion = new ContentLoadCriterion(criterion, peeking)
    const languageValid = yield call(loadCityContent, dataContainer, city, language, loadCriterion)
    // Only get languages if we've loaded them, otherwise we're peeking
    const cityLanguages: Array<LanguageModel> = loadCriterion.shouldLoadLanguages()
      ? ((yield call(dataContainer.getLanguages, city)) as Array<LanguageModel>)
      : []

    if (languageValid) {
      const categoriesMap: CategoriesMapModel = (yield call(
        dataContainer.getCategoriesMap,
        city,
        language
      )) as CategoriesMapModel
      const resourceCache: LanguageResourceCacheStateType = (yield call(
        dataContainer.getResourceCache,
        city,
        language
      )) as LanguageResourceCacheStateType
      const lastUpdate: Moment | null = (yield call(dataContainer.getLastUpdate, city, language)) as Moment | null
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
      yield put(push)
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

export default function* (dataContainer: DataContainer): Generator<ForkEffect, void> {
  yield takeEvery('FETCH_CATEGORY', fetchCategory, dataContainer)
}
