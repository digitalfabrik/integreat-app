// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'

export const LANDING_ROUTE = 'LANDING'

export const goToLanding = (language: string) => createAction<string, { language: string }>(LANDING_ROUTE)({language})

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await citiesEndpoint.loadData(dispatch, getState().cities)
  }
}
