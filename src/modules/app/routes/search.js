// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const SEARCH_ROUTE = 'SEARCH'

export const goToSearch = (city: string, language: string) =>
  createAction<string, { city: string, language: string }>(SEARCH_ROUTE)({city, language})

export const getSearchPath = (city: string, language: string): string => `/${city}/${language}/search`

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
