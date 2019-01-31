// @flow

import type { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import type {
  InsertCitiesActionType,
  SelectCitiesFailedActionType
} from '../../app/StoreActionType'
import MemoryDatabase from '../MemoryDatabase'
import fetchCities from './fetchCities'

function * selectCities (database: MemoryDatabase): Saga<void> {
  try {
    yield call(fetchCities, database)

    const insert: InsertCitiesActionType = {
      type: `INSERT_CITIES`,
      params: {cities: database.cities}
    }
    yield put(insert)
  } catch (e) {
    const failed: SelectCitiesFailedActionType = {
      type: `SELECT_CITIES_FAILED`,
      message: e.message
    }
    yield put(failed)
  }
}

export default function * (database: MemoryDatabase): Saga<void> {
  yield takeLatest(`SELECT_CITIES`, selectCities, database)
}
