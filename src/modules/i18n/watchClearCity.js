// @flow

import type { Saga } from 'redux-saga'
import { takeLatest, call } from 'redux-saga/effects'
import AppSettings from '../settings/AppSettings'
import * as NotificationsManager from '../../modules/notifications/NotificationsManager'

export function * clearCity (): Saga<void> {
  const appSettings = new AppSettings()
  const previousSelectedCity = yield call(appSettings.loadSelectedCity)
  const previousContentLanguage = yield call(appSettings.loadContentLanguage)
  yield call(() => NotificationsManager.unsubscribeNews(previousSelectedCity, previousContentLanguage))
  yield call(appSettings.clearSelectedCity)
}

export default function * (): Saga<void> {
  yield takeLatest('CLEAR_CITY', clearCity)
}
