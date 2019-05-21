// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { FetchEventFailedActionType } from '../../app/StoreActionType'

const fetchEventFailed = (state: CityContentStateType, action: FetchEventFailedActionType): CityContentStateType => {
  const {key, message} = action.params

  return {
    ...state,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: {
        error: true,
        message
      }
    }
  }
}

export default fetchEventFailed
