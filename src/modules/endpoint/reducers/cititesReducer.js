// @flow

import type { CitiesFetchActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'
import { defaultCitiesState } from '../../app/StateType'

export default (state: CitiesStateType = defaultCitiesState, action: CitiesFetchActionType): CitiesStateType => {
  switch (action.type) {
    case 'FETCH_CITIES_REQUEST':
      return {lastUpdated: undefined, error: undefined}
    case 'CITIES_FETCH_SUCCEEDED':
      return {lastUpdated: new Date().toISOString(), error: undefined}
    case 'CITIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    default:
      return state
  }
}
