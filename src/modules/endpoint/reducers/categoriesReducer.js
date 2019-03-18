// @flow

import type { CategoriesActionType } from '../../app/StoreActionType'

import type { CategoriesStateType } from '../../app/StateType'
import { defaultCategoriesState } from '../../app/StateType'
import switchLanguage from './switchLanguage'
import pushCategory from './pushCategory'

export default (
  state: CategoriesStateType = defaultCategoriesState, action: CategoriesActionType
): CategoriesStateType => {
  switch (action.type) {
    case 'PUSH_CATEGORY':
      return pushCategory(state, action)
    case 'SWITCH_CATEGORY_LANGUAGE':
      return switchLanguage(state, action)
    case 'CLEAR_CATEGORY':
      const {key} = action.params
      delete state.routeMapping[key]
      return state
    default:
      return state
  }
}
