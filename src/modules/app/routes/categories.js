import { categoriesFetcher, locationLayoutFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const prev = state.location.prev
    const query = state.location.payload.query
    const categoryId = query ? query.categoryId : undefined

    let categories = state.categories
    if (!categories || prev.payload.city !== city || prev.payload.language !== language) {
      categories = await categoriesFetcher({city, language}, dispatch)
    }

    if (categoryId) {
      try {
        const category = categories.getCategoryById(Number(categoryId))
        dispatch({type: 'CATEGORIES', payload: {city, language, categoryPath: category.path}})
      } catch (e) {
        dispatch({type: 'CATEGORY_ID_NOT_FOUND', payload: categoryId})
      }
    } else {
      await locationLayoutFetcher(dispatch, getState)
    }
  }
}

export default route
