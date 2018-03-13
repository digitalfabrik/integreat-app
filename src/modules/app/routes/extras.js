import { extrasFetcher, languagesFetcher, locationsFetcher, sprungbrettFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:location/:language/extras(/:extra)',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {location, language, extra} = state.router.payload

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

    let extras = state[location][language].extras
    if (!extras) {
      extras = await extrasFetcher({location, language})

      dispatch({type: 'EXTRAS_FETCHED', payload: {location, language, extras}})
    }

    const sprungbrettModel = extras.find(_extra => _extra.alias === 'sprungbrett')
    if (extra === 'sprungbrett' && sprungbrettModel) {
      let sprungbrett = state[location][language].sprungbrett
      if (!sprungbrett) {
        sprungbrett = await sprungbrettFetcher({url: sprungbrettModel.url})

        dispatch({type: 'SPRUNGBRETT_FETCHED', payload: {location, language, sprungbrett}})
      }
    }
  }
}

export default route
