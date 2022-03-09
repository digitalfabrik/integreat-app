import { call, SagaGenerator, spawn, takeLatest } from 'typed-redux-saga'

import appSettings from '../utils/AppSettings'
import * as NotificationsManager from '../utils/PushNotificationsManager'

export function* clearCity(): SagaGenerator<void> {
  const { selectedCity, contentLanguage, allowPushNotifications } = yield* call(appSettings.loadSettings)

  if (allowPushNotifications && selectedCity && contentLanguage) {
    yield* spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage)
  }

  yield* call(appSettings.clearSelectedCity)
}

export default function* clearCitySaga(): SagaGenerator<void> {
  yield* takeLatest('CLEAR_CITY', clearCity)
}
