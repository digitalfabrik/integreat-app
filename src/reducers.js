import { combineReducers } from 'redux'
import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { transform } from 'lodash/object'

import { endpoints } from './endpoints'

let reducers = transform(endpoints, (result, endpoint) => {
  let defaultState = {data: null, isFetching: false}
  let requestReducer = (state, action) => ({...state, isFetching: action.payload.isFetching})
  let receiveReducer = (state, action) => ({...state, isFetching: action.payload.isFetching, data: action.payload.data})
  let invalidateReducer = (state, action) => ({...state, isFetching: action.payload.isFetching, data: null})

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.receiveAction, receiveReducer, defaultState),
    handleAction(endpoint.requestAction, requestReducer, defaultState),
    handleAction(endpoint.invalidateAction, invalidateReducer, defaultState)
  )
}, {})

const rootReducer = combineReducers(reducers)

export default rootReducer
