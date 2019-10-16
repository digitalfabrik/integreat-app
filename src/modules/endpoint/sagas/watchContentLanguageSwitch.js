// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import type {
  MorphContentLanguageActionType,
  SetContentLanguageActionType,
  SwitchContentLanguageActionType,
  SwitchContentLanguageFailedActionType
} from '../../app/StoreActionType'
import type { DataContainer } from '../DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import AppSettings from '../../settings/AppSettings'
import { Alert } from 'react-native'

export function * switchContentLanguage (dataContainer: DataContainer, action: SwitchContentLanguageActionType): Saga<void> {
  const { newLanguage, city, t } = action.params
  try {
    // todo Use netinfo to decide whether offline and language not yet downloaded
    // netInfo.isInternetReachable only available since v4.1.0, but with v4.0.0 netinfo was migrated to androidx

    // We never want to force a refresh when switching languages
    yield call(
      loadCityContent, dataContainer, city, newLanguage,
      new ContentLoadCriterion({ forceUpdate: false, shouldRefreshResources: true }, false)
    )

    const [categories, resourceCache, events] = yield all([
      call(dataContainer.getCategoriesMap, city, newLanguage),
      call(dataContainer.getResourceCache, city, newLanguage),
      call(dataContainer.getEvents, city, newLanguage)
    ])

    // Only set new language after fetch succeeded
    const appSettings = new AppSettings()
    yield call(appSettings.setContentLanguage, newLanguage)

    const setContentLanguage: SetContentLanguageActionType = {
      type: 'SET_CONTENT_LANGUAGE', params: { contentLanguage: newLanguage }
    }
    yield put(setContentLanguage)

    const insert: MorphContentLanguageActionType = {
      type: `MORPH_CONTENT_LANGUAGE`,
      params: {
        newCategoriesMap: categories,
        newResourceCache: resourceCache,
        newEvents: events,
        newLanguage
      }
    }
    yield put(insert)
  } catch (e) {
    if (e.message === 'Network request failed') {
      Alert.alert(t('pageTitle'), t('generalError'))
    }
    console.error(e)
    const failed: SwitchContentLanguageFailedActionType = {
      type: `SWITCH_CONTENT_LANGUAGE_FAILED`,
      params: {
        message: `Error in switchContentLanguage: ${e.message}`
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest(`SWITCH_CONTENT_LANGUAGE`, switchContentLanguage, dataContainer)
}
