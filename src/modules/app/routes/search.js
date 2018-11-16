// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const SEARCH_ROUTE = 'SEARCH'

export const getSearchPath = ({city, language}: {|city: string, language: string|}): string =>
  `/${city}/${language}/search`

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const searchRoute: Route = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(categoriesEndpoint, dispatch, state.categories, {city, language})
  }
}

export default searchRoute
