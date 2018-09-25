// @flow

import type {
  LanguagesFetchActionType,
  LanguagesFetchFailedActionType,
  LanguagesFetchSucceededActionType
} from '../../app/StoreActionType'
import type { LanguagesStateType } from '../../app/StateType'

const initialCity = {languages: {}, error: undefined}

const success = (state, action: LanguagesFetchSucceededActionType): any => {
  const city = action.city
  const previousCity = state[city] || initialCity

  const newCity = {...previousCity, languages: action.payload.data}
  return {...state, [city]: newCity}
}

const failed = (state, action: LanguagesFetchFailedActionType): any => {
  const city = action.city
  const previousCity = state[city] || initialCity

  const newCity = {...previousCity, error: action.message}
  return {...state, [city]: newCity}
}

export default (state: LanguagesStateType = {}, action: LanguagesFetchActionType): any => {
  switch (action.type) {
    case 'LANGUAGES_FETCH_SUCCEEDED':
      return success(state, action)
    case 'LANGUAGES_FETCH_FAILED':
      return failed(state, action)
    default:
      return state
  }
}
