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
  // Changes isFetching state
  let requestReducer = (state, action) => ({...state, isFetching: action.payload.isFetching})
  // Changes isFetching state and sets the received data
  let receiveReducer = (state, action) => ({...state, isFetching: action.payload.isFetching, data: action.payload.data})
  // Changes isFetching state and sets the received data to null
  let invalidateReducer = (state, action) => ({...state, isFetching: action.payload.isFetching, data: null})

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.receiveAction, receiveReducer, defaultState),
    handleAction(endpoint.requestAction, requestReducer, defaultState),
    handleAction(endpoint.invalidateAction, invalidateReducer, defaultState)
  )

  return result
}, {})

reducers['language'] = handleAction(setLanguage,
  (state, action) => ({...state, language: action.payload.language}),
  {language: DEFAULT_LANGUAGE})

export default combineReducers(reducers)
