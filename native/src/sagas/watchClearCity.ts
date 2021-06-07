import { call, spawn, takeLatest } from 'redux-saga/effects'
import AppSettings, { SettingsType } from '../services/AppSettings'
import * as NotificationsManager from '../services/PushNotificationsManager'
import { SagaIterator } from 'redux-saga'

export function* clearCity(): SagaIterator<void> {
  const appSettings = new AppSettings()
  const { selectedCity, contentLanguage, allowPushNotifications }: SettingsType = yield call(appSettings.loadSettings)

  if (allowPushNotifications && selectedCity && contentLanguage) {
    yield spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage)
  }

  yield call(appSettings.clearSelectedCity)
}

export default function* (): SagaIterator<void> {
  yield takeLatest('CLEAR_CITY', clearCity)
}
