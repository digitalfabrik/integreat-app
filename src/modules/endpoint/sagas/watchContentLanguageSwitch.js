// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type {
  MorphContentLanguageActionType, SwitchContentLanguageActionType, SwitchContentLanguageFailedActionType
} from '../../app/StoreActionType'
import DataContainer from '../DataContainer'
import loadCityContent from './loadCityContent'

function * switchContentLanguage (dataContainer: DataContainerInterface, action: SwitchContentLanguageActionType): Saga<void> {
  const {city, newLanguage} = action.params
  try {
    yield call(loadCityContent, dataContainer, city, newLanguage)

    const [categories, resourceCache, events] = yield all([
      call(dataContainer.getCategoriesMap),
      call(dataContainer.getResourceCache),
      call(dataContainer.getEvents)
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
