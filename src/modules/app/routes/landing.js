import { locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/',
  thunk: (dispatch, getState) => {
    if (!getState().locationModels) {
      locationsFetcher(dispatch)
    }
  }
}

export default route
