// @flow

import { extrasEndpoint } from '@integreat-app/integreat-api-client'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const EXTRAS_ROUTE = 'EXTRAS'

export const goToExtras = (city: string, language: string) =>
  createAction<string, { city: string, language: string }>(EXTRAS_ROUTE)({city, language})

export const getExtraPath = (city: string, language: string, internalExtra: ?string): string =>
  `/${city}/${language}/extras${internalExtra ? `/${internalExtra}` : ''}`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras/sprungbrett
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute: Route = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  }
}
