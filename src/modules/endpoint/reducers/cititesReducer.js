// @flow

import type { CitiesFetchActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'

export default (state: CitiesStateType = {json: undefined, error: undefined}, action: CitiesFetchActionType): any => {
  switch (action.type) {
    case 'CITIES_FETCH_SUCCEEDED':
      return {...state, json: action.payload.data}
    case 'CITIES_FETCH_FAILED':
      return {...state, error: action.message}
    default:
      return state
  }
}
