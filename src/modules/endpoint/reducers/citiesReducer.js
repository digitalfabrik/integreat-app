// @flow

import type { CitiesActionType } from '../../app/StoreActionType'
import type { CitiesStateType, ErrorStateType } from '../../app/StateType'
import { defaultCitiesState } from '../../app/StateType'

export default (
  state: CitiesStateType | ErrorStateType = defaultCitiesState, action: CitiesActionType
): CitiesStateType | ErrorStateType => {
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
