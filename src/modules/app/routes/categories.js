import { categoriesFetcher, languagesFetcher, locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:location/:language(/:category)',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {location, language} = state.router.payload
    const categoryId = state.router.query.categoryId

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

    let categories = state[location][language].categories
    if (!categories) {
      categories = await categoriesFetcher({location, language})

      dispatch({type: 'CATEGORIES_FETCHED', payload: {location, language, categories}})
    }

    if (categoryId) {
      const category = categories.getCategoryById(Number(categoryId))
      dispatch({type: 'CATEGORIES', payload: {location, language, category: category.path}})
    }
  }
}

export default route
