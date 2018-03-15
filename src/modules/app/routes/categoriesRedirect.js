// @flow

import { categoriesFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { goToCategories } from './categories'
import { clearStoreOnLanguageChange } from '../../endpoint/remover'

export const CATEGORIES_REDIRECT_ROUTE = 'CATEGORIES_REDIRECT'
export const goToCategoriesRedirect = (city: string, language: string, categoryId: number) =>
  createAction(CATEGORIES_REDIRECT_ROUTE)({city, language, categoryId})

export const categoriesRedirectRoute = {
  path: '/:city/:language/redirect/:categoryId',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, categoryId} = state.location.payload

    clearStoreOnLanguageChange(dispatch, getState)

    const categories = await categoriesFetcher(dispatch, {city, language})

    try {
      const category = categories.getCategoryById(Number(categoryId))
      dispatch(goToCategories(city, language, category.path))
    } catch (e) {
      dispatch({type: 'CATEGORY_ID_NOT_FOUND', payload: categoryId})
    }
  }
}
