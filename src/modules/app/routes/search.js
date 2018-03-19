// @flow

import { categoriesFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const SEARCH_ROUTE = 'SEARCH'

export const goToSearch = (city: string, language: string) => createAction(SEARCH_ROUTE)({city, language})

/**
 * SearchRoute, matches /augsburg/de/search
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const searchRoute = {
  path: '/:city/:language/search',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    if (!state.categories) {
      await categoriesFetcher(dispatch, {city, language})
    }
  }
}
