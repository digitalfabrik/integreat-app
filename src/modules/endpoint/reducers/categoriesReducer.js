// @flow

import type {
  CategoriesFetchActionType,
  CategoriesFetchFailedActionType,
  CategoriesFetchPartiallySucceededActionType
} from '../../app/StoreActionType'
import type { CategoriesStateType } from '../../app/StateType'

const partially = (state, action: CategoriesFetchPartiallySucceededActionType): any => {
  const city = action.city
  const language = action.language
  const previousCity = state[city] || {json: {}, error: undefined}

  const newJson = {...previousCity.json, [language]: action.payload.data}
  const newCity = {...previousCity, json: newJson}
  return {...state, [city]: newCity}
}

const failed = (state, action: CategoriesFetchFailedActionType): any => {
  const city = action.city
  const previousCity = state[city] || {json: undefined, error: undefined}

  const newCity = {...previousCity, error: action.message, ready: false}
  return {...state, [city]: newCity}
}

export default (state: CategoriesStateType = {}, action: CategoriesFetchActionType): any => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_REQUEST':
      return {}
    case 'CATEGORIES_FETCH_PARTIALLY_SUCCEEDED':
      return partially(state, action)
    case 'CATEGORIES_FETCH_FAILED':
      return failed(state, action)
    default:
      return state
  }
}
