// @flow

import { categoriesEndpoint } from '@integreat-app/integreat-api-client'
import { createAction } from 'redux-actions'

import fetchData from '../fetchData'
import type { Dispatch, GetState, Route } from 'redux-first-router'

export const CATEGORIES_ROUTE = 'CATEGORIES'

export const goToCategories = (city: string, language: string, categoryPath: ?string) =>
  createAction<string, { city: string, language: string, categoryPath: ?string }>(CATEGORIES_ROUTE)({
    city,
    language,
    categoryPath
  })

export const getCategoryPath = (city: string, language: string, categoryPath: ?string): string =>
  `/${city}/${language}${categoryPath ? `/${categoryPath}` : ''}`

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, {city, language})
  }
}
