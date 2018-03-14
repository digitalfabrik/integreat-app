import { eventsFetcher, languagesFetcher, citiesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/events/:eventId?',
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
  }
}

export default route
