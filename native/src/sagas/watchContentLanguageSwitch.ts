import { all, call, put, SagaGenerator, spawn, takeLatest } from 'typed-redux-saga'

import { fromError } from 'api-client'

import { ContentLoadCriterion } from '../models/ContentLoadCriterion'
import {
  EnqueueSnackbarActionType,
  MorphContentLanguageActionType,
  SetContentLanguageActionType,
  SwitchContentLanguageActionType,
  SwitchContentLanguageFailedActionType,
} from '../redux/StoreActionType'
import appSettings from '../utils/AppSettings'
import { DataContainer } from '../utils/DataContainer'
import * as NotificationsManager from '../utils/PushNotificationsManager'
import { getErrorMessage } from '../utils/helpers'
import { reportError } from '../utils/sentry'
import loadCityContent from './loadCityContent'

export function* switchContentLanguage(
  dataContainer: DataContainer,
  action: SwitchContentLanguageActionType
): SagaGenerator<void> {
  const { newLanguage, city } = action.params

  try {
    // We never want to force a refresh when switching languages
    yield* call(
      loadCityContent,
      dataContainer,
      city,
      newLanguage,
      new ContentLoadCriterion(
        {
          forceUpdate: false,
          shouldRefreshResources: true,
        },
        false
      )
    )
    const { categories, resourceCache, events, pois } = yield* all({
      categories: call(dataContainer.getCategoriesMap, city, newLanguage),
      resourceCache: call(dataContainer.getResourceCache, city, newLanguage),
      events: call(dataContainer.getEvents, city, newLanguage),
      pois: call(dataContainer.getPois, city, newLanguage),
    })
    const { selectedCity, contentLanguage, allowPushNotifications } = yield* call(appSettings.loadSettings)

    // Unsubscribe from prev. city notifications
    if (contentLanguage !== newLanguage && allowPushNotifications && contentLanguage && selectedCity) {
      yield* spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage)
    }

    // Only set new language after fetch succeeded
    yield* call(appSettings.setContentLanguage, newLanguage)
    const setContentLanguage: SetContentLanguageActionType = {
      type: 'SET_CONTENT_LANGUAGE',
      params: {
        contentLanguage: newLanguage,
      },
    }
    yield* put(setContentLanguage)
    const insert: MorphContentLanguageActionType = {
      type: 'MORPH_CONTENT_LANGUAGE',
      params: {
        newCategoriesMap: categories,
        newResourceCache: resourceCache,
        newEvents: events,
        newPois: pois,
        newLanguage,
      },
    }
    yield* put(insert)
  } catch (e) {
    const enqueueSnackbar: EnqueueSnackbarActionType = {
      type: 'ENQUEUE_SNACKBAR',
      params: {
        text: fromError(e),
      },
    }
    yield* put(enqueueSnackbar)
    reportError(e)
    const failed: SwitchContentLanguageFailedActionType = {
      type: 'SWITCH_CONTENT_LANGUAGE_FAILED',
      params: {
        message: `Error in switchContentLanguage: ${getErrorMessage(e)}`,
      },
    }
    yield* put(failed)
  }
}

export default function* switchContentLanguageSaga(dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeLatest('SWITCH_CONTENT_LANGUAGE', switchContentLanguage, dataContainer)
}
