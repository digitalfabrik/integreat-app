// @flow

import { defaultCityContentState } from '../../app/StateType'
import morphContentLanguage from './morphContentLanguage'
import pushCategory from './pushCategory'
import type { CityContentStateType } from '../../app/StateType'
import pushEvent from './pushEvent'
import type { CityContentActionType } from '../../app/StoreActionType'
import pushLanguage from './pushLanguage'
import clearEvent from './clearEvent'
import clearCategory from './clearCategory'

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
    case 'PUSH_CONTENT_LANGUAGE':
      return pushLanguage(state, action)
    case 'CLEAR_CATEGORY':
      return clearCategory(state, action)
    case 'CLEAR_EVENT':
      return clearEvent(state, action)
    default:
      return state
  }
}
