// @flow

import type { CategoriesFetchActionType } from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

export default (state: CategoriesStateType = {}, action: CategoriesFetchActionType): any => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return {}
    case 'CATEGORIES_FETCH_PARTIALLY_SUCCEEDED':
      const city = action.city
      const language = action.language
      const previousCity = state[city] || {json: {}, error: undefined}

      const newJson = {...previousCity.json, [language]: action.payload.data}
      const newCity = {...previousCity, json: newJson}
      return {...state, [city]: newCity}
    case 'CATEGORIES_FETCH_FAILED':
      return {...state, error: action.message}
    default:
      return state
  }
}
