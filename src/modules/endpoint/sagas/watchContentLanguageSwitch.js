// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type {
  MorphContentLanguageActionType, SwitchContentLanguageActionType, SwitchContentLanguageFailedActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'

function * switchContentLanguage (dataContainer: DataContainer, action: SwitchContentLanguageActionType): Saga<void> {
  const {city, newLanguage} = action.params
  try {
    // We never want to force a refresh when switching languages
    yield call(
      loadCityContent, dataContainer, city, newLanguage,
      new ContentLoadCriterion({forceUpdate: false, shouldRefreshResources: true})
    )

    const context = new DatabaseContext(city, newLanguage)
    const [categories, resourceCache, events] = yield all([
      call(dataContainer.getCategoriesMap, context),
      call(dataContainer.getResourceCache, context),
      call(dataContainer.getEvents, context)
    ])

    const insert: MorphContentLanguageActionType = {
      type: `MORPH_CONTENT_LANGUAGE`,
      params: {
        newCategoriesMap: categories,
        newResourceCache: resourceCache,
        newEvents: events,
        newLanguage: newLanguage
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: SwitchContentLanguageFailedActionType = {
      type: `SWITCH_CONTENT_LANGUAGE_FAILED`,
      message: `Error in fetchCategory: ${e.message}`
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`SWITCH_CONTENT_LANGUAGE`, switchContentLanguage, dataContainer)
}
