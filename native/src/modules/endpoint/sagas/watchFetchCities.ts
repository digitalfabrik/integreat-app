import { Saga } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'
import { FetchCitiesActionType, FetchCitiesFailedActionType, PushCitiesActionType } from '../../app/StoreActionType'
import { DataContainer } from '../DataContainer'
import loadCities from './loadCities'
import { fromError } from '../../error/ErrorCodes'
export function* fetchCities(dataContainer: DataContainer, action: FetchCitiesActionType): Saga<void> {
  try {
    const cities = yield call(loadCities, dataContainer, action.params.forceRefresh)
    const insert: PushCitiesActionType = {
      type: 'PUSH_CITIES',
      params: {
        cities: cities
      }
    }
    yield put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchCitiesFailedActionType = {
      type: 'FETCH_CITIES_FAILED',
      params: {
        message: `Error in fetchCities: ${e.message}`,
        code: fromError(e)
      }
    }
    yield put(failed)
  }
}
export default function* (dataContainer: DataContainer): Saga<void> {
  yield takeLatest('FETCH_CITIES', fetchCities, dataContainer)
}
