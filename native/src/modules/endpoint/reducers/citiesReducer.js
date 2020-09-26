// @flow

import type { StoreActionType } from '../../app/StoreActionType'
import type { CitiesStateType } from '../../app/StateType'
import { defaultCitiesState } from '../../app/StateType'

export default (state: CitiesStateType = defaultCitiesState, action: StoreActionType): CitiesStateType => {
  switch (action.type) {
    case 'FETCH_CITIES':
      return { status: 'loading' }
    case 'PUSH_CITIES':
      return { status: 'ready', models: action.params.cities }
    case 'FETCH_CITIES_FAILED':
      return { status: 'error', message: action.params.message, code: action.params.code }
    default:
      return state
  }
}
