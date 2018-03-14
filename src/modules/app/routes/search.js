import { citiesFetcher, categoriesFetcher, eventsFetcher, languagesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/search',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    if (!state.cities) {
      await citiesFetcher(dispatch, city)
    }

    if (!state.languages) {
      await languagesFetcher({city}, dispatch, language)
    }

    if (!state.events) {
      await eventsFetcher({city, language}, dispatch)
    }

    if (!state.categories) {
      await categoriesFetcher({city, language}, dispatch)
    }
  }
}
export default route
