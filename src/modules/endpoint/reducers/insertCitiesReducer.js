// @flow

import type { CitiesActionType } from '../../app/StoreActionType'
import type { CitiesSelectionStateType } from '../../app/StateType'
import { defaultCitiesSelectionState } from '../../app/StateType'

export default (
  state: CitiesSelectionStateType = defaultCitiesSelectionState, action: CitiesActionType
): CitiesSelectionStateType => {
  switch (action.type) {
    case 'INSERT_CITIES':
      return {models: action.params.cities}
    default:
      return state
  }
}
