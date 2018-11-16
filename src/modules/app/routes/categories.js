// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import fetchData from '../fetchData'
import type { Dispatch, GetState, Route } from 'redux-first-router'

export type CategoriesRouteParamsType = {|city: string, language: string|}

export const CATEGORIES_ROUTE = 'CATEGORIES'

export const getCategoriesPath = ({city, language}: CategoriesRouteParamsType): string => `/${city}/${language}`

/**
 * CategoriesRoute, matches /augsburg/de*
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const categoriesRoute: Route = {
  path: '/:city/:language/:categoryPath*',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, { city, language })
  }
}

export default categoriesRoute
