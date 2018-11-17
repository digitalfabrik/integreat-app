// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const LANDING_ROUTE = 'LANDING'

export const getLandingPath = ({language}: {|language: string|}): string => `/landing/${language}`

/**
 * LandingRoute, matches /landing/de
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const landingRoute: Route = {
  path: '/landing/:language',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await fetchData(citiesEndpoint, dispatch, getState().cities)
  }
}

export default landingRoute
