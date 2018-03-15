import { categoriesFetcher } from '../../endpoint/fetchers'

const route = {
  path: '/:city/:language/redirect/:categoryId',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language, categoryId} = state.location.payload

    const categories = await categoriesFetcher(dispatch, {city, language})

    try {
      const category = categories.getCategoryById(Number(categoryId))
      dispatch({type: 'CATEGORIES', payload: {city, language, categoryPath: category.path}})
    } catch (e) {
      dispatch({type: 'CATEGORY_ID_NOT_FOUND', payload: categoryId})
    }
  }
}

export default route
