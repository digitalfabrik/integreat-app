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
import * as NotificationsManager from '../../../modules/notifications/NotificationsManager'

export function * switchContentLanguage (dataContainer: DataContainer, action: SwitchContentLanguageActionType): Saga<void> {
  const { newLanguage, city, t } = action.params
  try {
    // todo Use netinfo to decide whether offline and language not yet downloaded
    // netInfo.isInternetReachable only available since v4.1.0, but with v4.0.0 netinfo was migrated to androidx
    // https://issues.integreat-app.de/browse/NATIVE-354

    // We never want to force a refresh when switching languages
    yield call(
      loadCityContent, dataContainer, city, newLanguage,
      new ContentLoadCriterion({
        forceUpdate: false,
        shouldRefreshResources: true
      }, false)
    )

    const [categories, resourceCache, events, pois] = yield all([
      call(dataContainer.getCategoriesMap, city, newLanguage),
      call(dataContainer.getResourceCache, city, newLanguage),
      call(dataContainer.getEvents, city, newLanguage),
      call(dataContainer.getPois, city, newLanguage)
    ])

    const appSettings = new AppSettings()

    // Unsubscribe from prev. city notifications
    const previousSelectedCity = yield call(appSettings.loadSelectedCity)
    const previousContentLanguage = yield call(appSettings.loadContentLanguage)
    if (previousContentLanguage !== newLanguage) {
      yield call(() => NotificationsManager.unsubscribeFromPreviousCity(previousSelectedCity, previousContentLanguage))
    }

    // Only set new language after fetch succeeded
    yield call(appSettings.setContentLanguage, newLanguage)

    const setContentLanguage: SetContentLanguageActionType = {
      type: 'SET_CONTENT_LANGUAGE',
      params: { contentLanguage: newLanguage }
    }
    yield put(setContentLanguage)

    const insert: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: categories,
        newResourceCache: resourceCache,
        newEvents: events,
        newPois: pois,
        newLanguage
      }
    }
    yield put(insert)
  } catch (e) {
    if (e.message === 'Network request failed') {
      // The alert should be replaced with an error component in https://issues.integreat-app.de/browse/NATIVE-359
      // Hence the TFunction should also be removed
      Alert.alert(t('languageSwitchFailedTitle'), t('languageSwitchFailedMessage'))
    }
    console.error(e)
    const failed: SwitchContentLanguageFailedActionType = {
      type: 'SWITCH_CONTENT_LANGUAGE_FAILED',
      params: {
        message: `Error in switchContentLanguage: ${e.message}`
      }
    }
    yield put(failed)
  }
}

export default function * (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('SWITCH_CONTENT_LANGUAGE', switchContentLanguage, dataContainer)
}
