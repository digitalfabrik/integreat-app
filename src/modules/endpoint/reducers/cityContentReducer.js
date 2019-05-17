// @flow

import type { CityContentStateType } from '../../app/StateType'
import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
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
    case 'MORPH_CONTENT_LANGUAGE':
      return morphContentLanguage(state, action)
    case 'FETCH_EVENT':
    case 'CLEAR_EVENT': {
      const {key} = action.params
      delete state.eventsRouteMapping[key]
      return state
    }
    case 'FETCH_CATEGORY':
    case 'CLEAR_CATEGORY': {
      const {key} = action.params
      delete state.categoriesRouteMapping[key]
      return state
    }
    default:
      return state
  }
}
