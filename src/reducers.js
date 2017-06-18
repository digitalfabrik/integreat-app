/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
import { combineReducers } from 'redux'
import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import ENDPOINTS from './endpoints'
import { DEFAULT_LANGUAGE, setLanguage } from './actions'

let reducers = ENDPOINTS.reduce((result, endpoint) => {
  let defaultState = {data: null, isFetching: false}
  let reducer = (state, action) => ({...state, ...action.payload})

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.receiveAction, reducer, defaultState),
    handleAction(endpoint.requestAction, reducer, defaultState),
    handleAction(endpoint.invalidateAction, reducer, defaultState)
  )

  return result
}, {})

reducers['language'] = handleAction(setLanguage,
  (state, action) => ({...state, language: action.payload.language}),
  {language: DEFAULT_LANGUAGE})

export default combineReducers(reducers)
