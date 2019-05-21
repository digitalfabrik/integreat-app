// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { FetchCategoryFailedActionType } from '../../app/StoreActionType'

const fetchCategoryFailed = (state: CityContentStateType, action: FetchCategoryFailedActionType): CityContentStateType => {
  const {key, message} = action.params

  return {
    ...state,
    categoriesRouteMapping: {
      ...state.categoriesRouteMapping,
      [key]: {
        error: true,
        message
      }
    }
  }
}

export default fetchCategoryFailed
