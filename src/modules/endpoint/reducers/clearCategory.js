// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { ClearCategoryActionType } from '../../app/StoreActionType'

const clearCategory = (state: CityContentStateType, action: ClearCategoryActionType): CityContentStateType => {
  const {key} = action.params
  const language = state.categoriesRouteMapping[key].previousLanguage
  delete state.categoriesRouteMapping[key]

  return {
    ...state,
    language
  }
}

export default clearCategory
