import { all, call, Effect, ForkEffect, put, spawn, takeLatest } from 'redux-saga/effects'
import {
  EnqueueSnackbarActionType,
  MorphContentLanguageActionType,
  SetContentLanguageActionType,
  SwitchContentLanguageActionType,
  SwitchContentLanguageFailedActionType
} from '../redux/StoreActionType'
import { DataContainer } from '../services/DataContainer'
import loadCityContent from './loadCityContent'
import { ContentLoadCriterion } from '../models/ContentLoadCriterion'
import AppSettings, { SettingsType } from '../services/AppSettings'
import * as NotificationsManager from '../services/PushNotificationsManager'
import { fromError } from 'api-client'

export function* switchContentLanguage(
  dataContainer: DataContainer,
  action: SwitchContentLanguageActionType
): Generator<Effect, void, any[] | SettingsType> {
  const { newLanguage, city } = action.params

  try {
    // We never want to force a refresh when switching languages
    yield call(
      loadCityContent,
      dataContainer,
      city,
      newLanguage,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true
        },
        false
      )
    )
    const [categories, resourceCache, events, pois] = (yield all([
      call(dataContainer.getCategoriesMap, city, newLanguage),
      call(dataContainer.getResourceCache, city, newLanguage),
      call(dataContainer.getEvents, city, newLanguage),
      call(dataContainer.getPois, city, newLanguage)
    ])) as Array<any>
    const appSettings = new AppSettings()
    const { selectedCity, contentLanguage, allowPushNotifications }: SettingsType = (yield call(
      appSettings.loadSettings
    )) as SettingsType

    // Unsubscribe from prev. city notifications
    if (contentLanguage !== newLanguage && allowPushNotifications && contentLanguage && selectedCity) {
      yield spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage)
    }

    // Only set new language after fetch succeeded
    yield call(appSettings.setContentLanguage, newLanguage)
    const setContentLanguage: SetContentLanguageActionType = {
      type: 'SET_CONTENT_LANGUAGE',
      params: {
        contentLanguage: newLanguage
      }
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
    const enqueueSnackbar: EnqueueSnackbarActionType = {
      type: 'ENQUEUE_SNACKBAR',
      params: {
        text: fromError(e)
      }
    }
    yield put(enqueueSnackbar)
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

export default function* (dataContainer: DataContainer): Generator<ForkEffect, void> {
  yield takeLatest('SWITCH_CONTENT_LANGUAGE', switchContentLanguage, dataContainer)
}
