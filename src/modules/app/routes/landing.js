import { locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/',
  thunk: (dispatch, getState) => {
    if (!getState().locations) {
      locationsFetcher(dispatch)
    }
  }
}

export default route
