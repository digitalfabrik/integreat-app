import {groupBy, sortBy} from "lodash/collection";
import {isEmpty} from "lodash/lang";

export const REQUEST_LOCATIONS = 'REQUEST_LOCATIONS';
export const RECEIVE_LOCATIONS = 'RECEIVE_LOCATIONS';

function requestLocations() {
  return {
    type: REQUEST_LOCATIONS
  }
}

function receiveLocations(json) {
  let locations = json.map(location => ({name: location.name, path: location.path}));
  locations = sortBy(locations, ['name']);
  locations = groupBy(locations, (location) => isEmpty(location.name) ? '?' : location.name[0].toUpperCase());

  return {
    type: RECEIVE_LOCATIONS,
    locations: locations
  }
}

function fetchLocations() {
  return dispatch => {
    dispatch(requestLocations());
    return fetch('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
      .then(response => response.json()).then(json => dispatch(receiveLocations(json)))
      .catch(ex => {
        throw ex
      });
  };
}

function shouldFetchLocations(state) {
  if (!state.fetchLocations) {
    return true;
  } else {
    return !state.fetchLocations.isFetching;
  }
}

export function fetchLocationsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchLocations(getState())) {
      return dispatch(fetchLocations())
    }
  }
}
