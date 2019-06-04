// @flow

import type { CitiesActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'
import { defaultCitiesState } from '../../app/StateType'

export default (
  state: CitiesStateType = defaultCitiesState, action: CitiesActionType
): CitiesStateType => {
  switch (action.type) {
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
