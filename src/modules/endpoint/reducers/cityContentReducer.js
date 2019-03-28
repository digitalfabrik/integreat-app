// @flow

import { defaultCityContentState } from '../../app/StateType'
import switchContentLanguage from './switchContentLanguage'
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
    case 'SWITCH_CONTENT_LANGUAGE': // todo:  Not working
      return switchContentLanguage(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.categoriesRouteMapping[key]
      return state
    default:
      return state
  }
}
