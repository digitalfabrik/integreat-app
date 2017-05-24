import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'

const restData = handleActions({
  REQUEST_DATA: (state, action) => ({...state, isFetching: action.payload.isFetching}),
  RECEIVE_DATA: (state, action) => ({...state, isFetching: action.payload.isFetching, data: action.payload.data})
}, {isFetching: false})

const rootReducer = combineReducers({
  restData
})

export default rootReducer
