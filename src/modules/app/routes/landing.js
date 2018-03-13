import { locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/',
  thunk: (dispatch, getState) => {
    if (getState().locations) { return }

    locationsFetcher().then(locations => dispatch({type: 'LOCATIONS_FETCHED', payload: {locations}}))
  }
}

export default route
