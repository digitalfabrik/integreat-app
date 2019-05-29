// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { FetchCategoryFailedActionType } from '../../app/StoreActionType'

const fetchCategoryFailed = (state: CityContentStateType, action: FetchCategoryFailedActionType): CityContentStateType => {
  const message: string = action.params.message

  return {...state, categoriesRouteMapping: {errorMessage: message}}
}

export default fetchCategoryFailed
