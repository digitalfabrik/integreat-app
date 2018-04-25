// @flow

import categoriesEndpoint from '../../endpoint/endpoints/categories'
import { createAction } from 'redux-actions'

import type { Action, Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const SEARCH_ROUTE = 'SEARCH'

export const goToSearch = (city: string, language: string): Action => createAction(SEARCH_ROUTE)({city, language})

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const searchRoute = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await categoriesEndpoint.loadData(dispatch, state.categories, {city, language})
  }
}
