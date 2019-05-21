// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { FetchCategoryFailedActionType } from '../../app/StoreActionType'

const fetchCategoryFailed = (state: CityContentStateType, action: FetchCategoryFailedActionType): CityContentStateType => {
  const {key, error} = action.params

  return {
    ...state,
    categoriesRouteMapping: {
      ...state.categoriesRouteMapping,
      [key]: {
        error
      }
    }
  }
}

export default fetchCategoryFailed
