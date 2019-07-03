// @flow

import type { Saga } from 'redux-saga'
import { takeLatest, call, put } from 'redux-saga/effects'
import LocalizationSettings from './LocalizationSettings'
import type { ClearCityContentActionType } from '../app/StoreActionType'

function * watchClearCity (): Saga<void> {
  const clearCityContent: ClearCityContentActionType = { type: 'CLEAR_CITY_CONTENT' }
  yield put(clearCityContent)

  const localizationSettings = new LocalizationSettings()
  yield call(localizationSettings.clearSelectedCity)
}

export default function * (): Saga<void> {
  yield takeLatest('CLEAR_CITY', watchClearCity)
}
