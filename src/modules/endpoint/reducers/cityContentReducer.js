// @flow

import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
import type { CityContentStateType } from '../../app/StateType'
import pushEvent from './pushEvent'
import type { CityContentActionType } from '../../app/StoreActionType'
import pushLanguages from './pushLanguages'

export default (
  state: CityContentStateType = defaultCityContentState, action: CityContentActionType
): CityContentStateType => {
  switch (action.type) {
    case 'PUSH_LANGUAGES':
      return pushLanguages(state, action)
    case 'PUSH_CATEGORY':
      return pushCategory(state, action)
    case 'PUSH_EVENT':
      return pushEvent(state, action)
    case 'MORPH_CONTENT_LANGUAGE':
      return morphContentLanguage(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.categoriesRouteMapping[key]
      return state
    case 'CLEAR_CITY_CONTENT':
      return defaultCityContentState
    default:
      return state
  }
}
