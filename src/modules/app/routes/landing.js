import { citiesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/',
  thunk: (dispatch, getState) => {
    if (!getState().cities) {
      citiesFetcher(dispatch)
    }
  }
}

export default route
