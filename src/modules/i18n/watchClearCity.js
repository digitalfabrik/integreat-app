// @flow

import type { Saga } from 'redux-saga'
import { takeLatest, call } from 'redux-saga/effects'
import AppSettings from '../settings/AppSettings'

function * watchClearCity (): Saga<void> {
  const appSettings = new AppSettings()
  yield call(appSettings.clearSelectedCity)
}

export default function * (): Saga<void> {
  yield takeLatest('CLEAR_CITY', watchClearCity)
}
