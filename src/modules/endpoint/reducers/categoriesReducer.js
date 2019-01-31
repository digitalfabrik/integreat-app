// @flow

import type { CategoriesFetchActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'
import { defaultCategoriesState } from '../../app/StateType'

export default (
  state: CategoriesStateType = defaultCategoriesState, action: CategoriesFetchActionType
): CategoriesStateType => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return state
    case 'CATEGORIES_FETCH_SUCCEEDED':
      const {lastUpdated} = action.payload

      return {
        lastUpdated: lastUpdated ? lastUpdated.toLocaleString() : state.lastUpdated,
        error: undefined
      }
    case 'CATEGORIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    default:
      return state
  }
}
