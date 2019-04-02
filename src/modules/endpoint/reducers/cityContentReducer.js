// @flow

import { defaultCityContentState } from '../../app/StateType'
import switchLanguage from './switchLanguage'
import pushCategory from './pushCategory'
import type { CityContentStateType } from '../../app/StateType'
import pushEvent from './pushEvent'
import type { CityContentActionType } from '../../app/StoreActionType'

export default (
  state: CityContentStateType = defaultCityContentState, action: CityContentActionType
): CityContentStateType => {
  switch (action.type) {
    case 'PUSH_CATEGORY':
      return pushCategory(state, action)
    case 'PUSH_EVENT':
      return pushEvent(state, action)
    case 'SWITCH_CITY_CONTENT_LANGUAGE': // todo:  Not working
      return switchLanguage(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.categoriesRouteMapping[key]
      return state
    default:
      return state
  }
}
