// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string) =>
  createAction(EXTRAS_ROUTE)({city, language})

export const getExtraPath = (city: string, language: string, internalExtra: ?string): string =>
  `/${city}/${language}/extras${internalExtra ? `/${internalExtra}` : ''}`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute = {
  path: '/:city/:language/extras',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await extrasEndpoint.loadData(dispatch, state.extras, {city, language})
  }
}
