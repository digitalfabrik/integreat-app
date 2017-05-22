import {combineReducers} from 'redux'
import {
  REQUEST_LOCATIONS, RECEIVE_LOCATIONS
} from './actions'

function fetchLocations(state = {isFetching: false, locations: {}}, action) {
  switch (action.type) {
    case REQUEST_LOCATIONS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_LOCATIONS:
      return Object.assign({}, state, {
        isFetching: false,
        locations: action.locations
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  fetchLocations
});

export default rootReducer
