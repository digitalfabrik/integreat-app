import { combineReducers } from 'redux'
import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import ENDPOINTS from './endpoints'
import { DEFAULT_LANGUAGE, setLanguage } from './actions'
import Payload from './endpoints/Payload'

/**
 * Contains all reducers from all endpoints which are defined in {@link './endpoints/'}
 */
let reducers = ENDPOINTS.reduce((result, endpoint) => {
  let defaultState = new Payload(false)
  let reducer = (state, action) => action.payload

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.receiveAction, reducer, defaultState),
    handleAction(endpoint.requestAction, reducer, defaultState),
    handleAction(endpoint.invalidateAction, reducer, defaultState)
  )

  return result
}, {})

// Additional reducers
/**
 * The reducer to store the current language
 */
reducers['language'] = handleAction(setLanguage,
  (state, action) => ({...state, ...action.payload}),
  {language: DEFAULT_LANGUAGE})

export default combineReducers(reducers)
