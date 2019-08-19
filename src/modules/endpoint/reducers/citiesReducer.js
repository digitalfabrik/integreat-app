// @flow

import type { StoreActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'
import { defaultCitiesState } from '../../app/StateType'

export default (
  state: CitiesStateType = defaultCitiesState, action: StoreActionType
): CitiesStateType => {
  switch (action.type) {
    case 'FETCH_CITIES':
      return {
        models: null
      }
    case 'PUSH_CITIES':
      return {
        models: action.params.cities
      }
    case 'FETCH_CITIES_FAILED':
      return {
        errorMessage: action.params.message
      }
    default:
      return state
  }
}
