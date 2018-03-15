import { categoriesFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/search',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload
    const prev = state.location.prev

    await locationLayoutFetcher(dispatch, getState)

    if (!state.categories || prev.payload.city !== city || prev.payload.language !== language) {
      await categoriesFetcher(dispatch, {city, language})
    }
  }
}
export default route
