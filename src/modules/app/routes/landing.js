import { citiesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:language',
  thunk: async (dispatch, getState) => {
    if (!getState().cities) {
      await citiesFetcher(dispatch)
    }
  }
}

export default route
