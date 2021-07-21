import { call, put, SagaGenerator, takeLatest } from 'typed-redux-saga'
import { FetchCitiesActionType, FetchCitiesFailedActionType, PushCitiesActionType } from '../redux/StoreActionType'
import { DataContainer } from '../utils/DataContainer'
import loadCities from './loadCities'
import { fromError } from 'api-client'

export function* fetchCities(dataContainer: DataContainer, action: FetchCitiesActionType): SagaGenerator<void> {
  try {
    const cities = yield* call(loadCities, dataContainer, action.params.forceRefresh)
    const insert: PushCitiesActionType = {
      type: 'PUSH_CITIES',
      params: {
        cities: cities
      }
    }
    yield* put(insert)
  } catch (e) {
    console.error(e)
    const failed: FetchCitiesFailedActionType = {
      type: 'FETCH_CITIES_FAILED',
      params: {
        message: `Error in fetchCities: ${e.message}`,
        code: fromError(e)
      }
    }
    yield* put(failed)
  }
}

export default function* (dataContainer: DataContainer): SagaGenerator<void> {
  yield* takeLatest('FETCH_CITIES', fetchCities, dataContainer)
}
