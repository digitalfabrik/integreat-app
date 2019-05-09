// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { ClearEventActionType } from '../../app/StoreActionType'

const clearEvent = (state: CityContentStateType, action: ClearEventActionType): CityContentStateType => {
  const {key} = action.params
  const language = state.eventsRouteMapping[key].previousLanguage
  delete state.eventsRouteMapping[key]

  return {
    ...state,
    language
  }
}

export default clearEvent
