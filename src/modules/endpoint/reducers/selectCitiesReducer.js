// @flow

import type { CitiesActionType } from '../../app/StoreActionType'
import type { CitiesSelectionStateType } from '../../app/StateType'
import { defaultCitiesSelectionState } from '../../app/StateType'
import MemoryDatabase from '../MemoryDatabase'

export default (database: MemoryDatabase) => (
  state: CitiesSelectionStateType = defaultCitiesSelectionState, action: CitiesActionType
): CitiesSelectionStateType => {
  switch (action.type) {
    case 'SELECT_CITIES':
      return {models: database.cities}
    default:
      return state
  }
}
