import { eventsFetcher, languagesFetcher, locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:location/:language/events(/:event)',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {location, language} = state.router.payload

    let locations = state.locations
    if (!locations) {
      locations = await locationsFetcher()

      dispatch({type: 'LOCATIONS_FETCHED', payload: {locations}})
    }

    if (!locations.find(_location => _location.code === location)) {
      dispatch({type: 'LOCATION_NOT_FOUND', payload: {location}})
    }

    let languages = state[location].languages
    if (!languages) {
      languages = await languagesFetcher({location})

      dispatch({type: 'LANGUAGES_FETCHED', payload: {location, languages}})
    }

    if (!languages.find(_language => _language.code === language)) {
      dispatch({type: 'LANGUAGE_NOT_FOUND', payload: {location, language}})
    }

    let events = state[location][language].events
    if (!events) {
      events = await eventsFetcher({location, language})

      dispatch({type: 'EVENTS_FETCHED', payload: {location, language, events}})
    }
  }
}

export default route
