// @flow

import { categoriesFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'
import { redirect } from 'redux-first-router'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { goToCategories } from './categories'
import { clearStoreOnLanguageChange } from '../../endpoint/actions/remover'
import { goToNotFound } from './notFound'

export const CATEGORIES_REDIRECT_ROUTE = 'CATEGORIES_REDIRECT'
export const goToCategoriesRedirect = (city: string, language: string, categoryId: number) =>
  createAction(CATEGORIES_REDIRECT_ROUTE)({city, language, categoryId})

/**
 * Route for changing the language in the categories route
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const categoriesRedirectRoute = {
  path: '/:city/:language/redirect/:categoryId',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language, categoryId} = state.location.payload

    clearStoreOnLanguageChange(dispatch, getState)

    const categories = await categoriesFetcher(dispatch, {city, language})

    try {
      const category = categories.getCategoryById(Number(categoryId))
      dispatch(redirect(goToCategories(city, language, category.path)))
    } catch (e) {
      dispatch(redirect(goToNotFound(city, language)))
    }
  }
}
