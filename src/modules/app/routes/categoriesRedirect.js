// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'
import { redirect } from 'redux-first-router'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { goToCategories } from './categories'
import { goToNotFound } from './notFound'
import CategoriesMapModel from '../../endpoint/models/CategoriesMapModel'

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

    const categoriesPayload = await categoriesEndpoint.loadData(dispatch, state.categories, {city, language})

    if (categoriesPayload.data instanceof CategoriesMapModel) {
      const category = categoriesPayload.data.findCategoryById(Number(categoryId))
      if (category) {
        dispatch(redirect(goToCategories(city, language, category.path)))
      } else {
        dispatch(redirect(goToNotFound()))
      }
    }
  }
}
