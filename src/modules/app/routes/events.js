import { eventsFetcher, languagesFetcher, citiesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/events(/:event)',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.citie.payload

    let cities = state.cities
    if (!cities) {
      cities = await citiesFetcher()

      dispatch({type: 'LOCATIONS_FETCHED', payload: {cities}})
    }

    if (!cities.find(_city => _city.code === city)) {
      dispatch({type: 'LOCATION_NOT_FOUND', payload: {city}})
    }

    let languages = state[citie].languages
    if (!languages) {
      languages = await languagesFetcher({citie})

      dispatch({type: 'LANGUAGES_FETCHED', payload: {citie, languages}})
    }

    if (!languages.find(_language => _language.code === language)) {
      dispatch({type: 'LANGUAGE_NOT_FOUND', payload: {citie, language}})
    }

    let events = state[citie][language].events
    if (!events) {
      events = await eventsFetcher({citie, language})

      dispatch({type: 'EVENTS_FETCHED', payload: {citie, language, events}})
    }
  }
}

export default route
