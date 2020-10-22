// @flow

import type { Saga } from 'redux-saga'
import { takeLatest, call, spawn } from 'redux-saga/effects'
import AppSettings from '../settings/AppSettings'
import * as NotificationsManager from '../push-notifications/PushNotificationsManager'
import buildConfig from '../app/constants/buildConfig'
import type { SettingsType } from '../settings/AppSettings'

export function * clearCity (): Saga<void> {
  const appSettings = new AppSettings()
  const { selectedCity, contentLanguage, allowPushNotifications }: SettingsType = yield call(appSettings.loadSettings)

  if (allowPushNotifications && selectedCity && contentLanguage) {
    yield spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage, buildConfig().featureFlags)
  }

  yield call(appSettings.clearSelectedCity)
}

export default function * (): Saga<void> {
  yield takeLatest('CLEAR_CITY', clearCity)
}
