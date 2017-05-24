import { combineReducers } from 'redux'
import { handleAction } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { transform } from 'lodash/object'

import { endpoints } from './endpoints'

let reducers = transform(endpoints, (result, endpoint) => {
  let defaultState = {data: {}, isFetching: false}
  let requestReducer = (state, action) => ({...state, isFetching: action.payload.isFetching})
  let receiveReducer = (state, action) => ({...state, isFetching: action.payload.isFetching, data: action.payload.data})

  result[endpoint.name] = reduceReducers(
    handleAction(endpoint.receiveAction, receiveReducer, defaultState),
    handleAction(endpoint.requestAction, requestReducer, defaultState)
  )
}, {})

const rootReducer = combineReducers(reducers)

export default rootReducer
