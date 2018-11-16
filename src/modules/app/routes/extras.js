// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import fetchData from '../fetchData'

export const EXTRAS_ROUTE = 'EXTRAS'

export const getExtrasPath = ({city, language}: {|city: string, language: string|}): string =>
  `/${city}/${language}/extras`

/**
 * ExtrasRoute, matches /augsburg/de/extras and /augsburg/de/extras
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const extrasRoute: RouterRouteType = {
  path: '/:city/:language/extras/:extraId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  }
}

export default extrasRoute
