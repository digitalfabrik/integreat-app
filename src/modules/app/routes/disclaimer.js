// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

export const getDisclaimerPath = ({city, language}: {|city: string, language: string|}): string =>
  `/${city}/${language}/disclaimer`

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await fetchData(disclaimerEndpoint, dispatch, state.disclaimer, {city, language})
  }
}

export default disclaimerRoute
