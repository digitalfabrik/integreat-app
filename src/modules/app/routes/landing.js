// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'

export const LANDING_ROUTE = 'LANDING'

export const goToLanding = (language: string) => createAction(LANDING_ROUTE)({language})

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const landingRoute = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await citiesEndpoint.loadData(dispatch, getState().cities)
  }
}
