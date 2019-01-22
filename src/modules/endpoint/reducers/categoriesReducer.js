// @flow

import type {
  CategoriesFetchActionType
} from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

export default (state: CategoriesStateType = {
  lastUpdated: undefined,
  error: undefined
}, action: CategoriesFetchActionType): any => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return {}
    case 'CATEGORIES_FETCH_SUCCEEDED':
      return {...state, lastUpdated: new Date().toISOString(), error: undefined}
    case 'CATEGORIES_FETCH_FAILED':
      return {...state, lastUpdated: undefined, error: action.message}
    default:
      return state
  }
}
