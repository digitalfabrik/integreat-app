import { disclaimerFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload
    const prev = state.location.prev

    await locationLayoutFetcher(dispatch, getState)

    if (!state.disclaimer || prev.payload.city !== city || prev.payload.language !== language) {
      await disclaimerFetcher(dispatch, {city, language})
    }
  }
}
export default route
