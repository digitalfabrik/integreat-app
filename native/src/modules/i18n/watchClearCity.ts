import { takeLatest, call, spawn, ForkEffect, Effect } from 'redux-saga/effects'
import AppSettings, {SettingsType} from '../settings/AppSettings'
import * as NotificationsManager from '../push-notifications/PushNotificationsManager'

export function* clearCity(): Generator<Effect, void, SettingsType> {
  const appSettings = new AppSettings()
  const { selectedCity, contentLanguage, allowPushNotifications }: SettingsType = yield call(appSettings.loadSettings)

  if (allowPushNotifications && selectedCity && contentLanguage) {
    yield spawn(NotificationsManager.unsubscribeNews, selectedCity, contentLanguage)
  }

  yield call(appSettings.clearSelectedCity)
}
export default function* (): Generator<ForkEffect, void> {
  yield takeLatest('CLEAR_CITY', clearCity)
}
