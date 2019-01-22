// @flow

import type { CitiesFetchActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'

export default (state: CitiesStateType = {
  lastUpdated: undefined,
  error: undefined
}, action: CitiesFetchActionType): any => {
  switch (action.type) {
    case 'FETCH_CITIES_REQUEST':
      return {}
    case 'CITIES_FETCH_SUCCEEDED':
      return {...state, lastUpdated: new Date().toISOString(), error: undefined}
    case 'CITIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    default:
      return state
  }
}
