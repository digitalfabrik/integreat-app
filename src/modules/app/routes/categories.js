import { categoriesFetcher, eventsFetcher, languagesFetcher, locationsFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:location/:language*',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {location, language} = state.location.payload

    const query = state.location.query
    const categoryId = query ? query.categoryId : undefined

    const locations = state.locationModels
    if (!locations) {
      await locationsFetcher(dispatch, location)
    }

    const languages = state.languages
    if (!languages) {
      await languagesFetcher({location}, dispatch, language)
    }

    const events = state.events
    if (!events) {
      await eventsFetcher({location, language}, dispatch)
    }

    let categories = state.categories
    if (!categories) {
      categories = await categoriesFetcher({location, language}, dispatch)
    }

    if (categoryId) {
      try {
        const category = categories.getCategoryById(Number(categoryId))
        dispatch({type: 'CATEGORIES', payload: {location, language, category: category.path}})
      } catch (e) {
        dispatch({type: 'CATEGORY_NOT_FOUND', payload: {categoryId}})
      }
    }
  }
}

export default route
