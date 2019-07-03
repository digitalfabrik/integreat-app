// @flow

import type { Saga } from 'redux-saga'
import { takeLatest, call, put } from 'redux-saga/effects'
import type { ClearCityContentActionType } from '../app/StoreActionType'
import AppSettings from '../settings/AppSettings'

function * watchClearCity (): Saga<void> {
  const clearCityContent: ClearCityContentActionType = { type: 'CLEAR_CITY_CONTENT' }
  yield put(clearCityContent)

  const appSettings = new AppSettings()
  yield call(appSettings.clearSelectedCity)
}

export default function * (): Saga<void> {
  yield takeLatest('CLEAR_CITY', watchClearCity)
}
