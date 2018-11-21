// @flow

import { citiesEndpoint } from '@integreat-app/integreat-api-client'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const LANDING_ROUTE = 'LANDING'

export const goToLanding = (language: string) => createAction<string, { language: string }>(LANDING_ROUTE)({language})

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}
