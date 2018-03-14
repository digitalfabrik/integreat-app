import { locationLayoutFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/events/:eventId?',
  thunk: async (dispatch, getState) => {
    await locationLayoutFetcher(dispatch, getState)
  }
}

export default route
