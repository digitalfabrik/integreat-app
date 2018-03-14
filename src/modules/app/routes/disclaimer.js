import { citiesFetcher, disclaimerFetcher, eventsFetcher, languagesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/disclaimer',
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

    if (!state.disclaimer) {
      await disclaimerFetcher({city, language}, dispatch)
    }
  }
}
export default route
