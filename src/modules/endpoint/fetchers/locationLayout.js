import { citiesFetcher, eventsFetcher, languagesFetcher } from '../../endpoint/fetchers'

const fetcher = async (dispatch, getState) => {
  const state = getState()
  const {city, language} = state.location.payload
  const params = {city: city, language: language}
  const prev = state.location.prev

  if (!state.cities) {
    await citiesFetcher(params, dispatch)
  }

  if (!state.languages || prev.payload.city !== city) {
    await languagesFetcher(params, dispatch)
  }

  if (!state.events || prev.payload.city !== city || prev.payload.language !== language) {
    await eventsFetcher(params, dispatch)
  }
}

export default fetcher
