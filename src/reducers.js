import { combineReducers } from 'redux'
import { handleAction } from 'redux-actions'
import { endpoints } from './endpoints'
import reduceReducers from 'reduce-reducers'
import { transform } from 'lodash/object'

let reducers = transform(endpoints, (result, endpoint) => {
  let defaultState = {data: {}, isFetching: false}
  let handlers = {
    REQUEST_DATA: (state, action) => ({...state, isFetching: action.payload.isFetching}),
    RECEIVE_DATA: (state, action) => ({...state, isFetching: action.payload.isFetching, data: action.payload.data})
  }

  result[endpoint.name] = reduceReducers(
    handleAction(
      endpoint.receiveData,
      handlers[endpoint.receiveData],
      defaultState
    ), handleAction(
      endpoint.requestData,
      handlers[endpoint.requestData],
      defaultState
    ))
}, {})

const rootReducer = combineReducers(reducers)

export default rootReducer
