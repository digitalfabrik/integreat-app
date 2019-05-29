// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { FetchEventFailedActionType } from '../../app/StoreActionType'

const fetchEventFailed = (state: CityContentStateType, action: FetchEventFailedActionType): CityContentStateType => {
  const message: string = action.params.message

  return {...state, eventsRouteMapping: {errorMessage: message}}
}

export default fetchEventFailed
