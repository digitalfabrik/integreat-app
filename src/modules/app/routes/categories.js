import { categoriesFetcher, eventsFetcher, languagesFetcher, citiesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language*',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const query = state.location.query
    const categoryId = query ? query.categoryId : undefined

    const cities = state.cities
    if (!cities) {
      await citiesFetcher(dispatch, city)
    }

    const languages = state.languages
    if (!languages) {
      await languagesFetcher({city}, dispatch, language)
    }

    const events = state.events
    if (!events) {
      await eventsFetcher({city, language}, dispatch)
    }

    let categories = state.categories
    if (!categories) {
      categories = await categoriesFetcher({city, language}, dispatch)
    }

    if (categoryId) {
      try {
        const category = categories.getCategoryById(Number(categoryId))
        dispatch({type: 'CATEGORIES', payload: {city, language, category: category.path}})
      } catch (e) {
        dispatch({type: 'CATEGORY_NOT_FOUND', payload: {categoryId}})
      }
    }
  }
}

export default route
